<?php
namespace Grav\Plugin;

use Grav\Common\Cache;
use Grav\Common\Plugin;
use Grav\Common\Uri;

class ProblemsPlugin extends Plugin
{
    protected $results = array();

    protected $check;

    /**
     * @return array
     */
    public static function getSubscribedEvents()
    {
        return [
            'onPluginsInitialized' => ['onPluginsInitialized', 100001],
            'onFatalException' => ['onFatalException', 0]
        ];
    }

    public function onFatalException()
    {
        if ($this->isAdmin()) {
            $this->active = false;
            return;
        }

        // Run through potential issues
        if ($this->problemChecker()) {
            $this->renderProblems();
        }
    }

    public function onPluginsInitialized()
    {
        if ($this->isAdmin()) {
            $this->active = false;
            return;
        }

        /** @var Cache $cache */
        $cache = $this->grav['cache'];
        $validated_prefix = 'problem-check-';

        $this->check = CACHE_DIR . $validated_prefix . $cache->getKey();

        if (!file_exists($this->check)) {
            // If no issues remain, save a state file in the cache
            if (!$this->problemChecker()) {
                // delete any existing validated files
                foreach (new \GlobIterator(CACHE_DIR . $validated_prefix . '*') as $fileInfo) {
                    @unlink($fileInfo->getPathname());
                }

                // create a file in the cache dir so it only runs on cache changes
                touch($this->check);

            } else {
                $this->renderProblems();
            }

        }
    }

    protected function renderProblems()
    {
        $theme = 'antimatter';

        /** @var Uri $uri */
        $uri = $this->grav['uri'];
        $baseUrlRelative = $uri->rootUrl(false);
        $themeUrl = $baseUrlRelative . '/' . USER_PATH . basename(THEMES_DIR) . '/' . $theme;
        $problemsUrl = $baseUrlRelative . '/user/plugins/problems';

        $html = file_get_contents(__DIR__ . '/html/problems.html');

        /**
         * Process the results, ignore the statuses passed as $ignore_status
         *
         * @param $results
         * @param $ignore_status
         */
        $processResults = function ($results, $ignore_status) {
            $problems = '';

            foreach ($results as $key => $result) {
                if ($key == 'files' || $key == 'apache' || $key == 'execute') {
                    foreach ($result as $key_text => $value_text) {
                        foreach ($value_text as $status => $text) {
                            if ($status == $ignore_status) continue;
                            $problems .= $this->getListRow($status, '<b>' . $key_text . '</b> ' . $text);
                        }
                    }
                } else {
                    foreach ($result as $status => $text) {
                        if ($status == $ignore_status) continue;
                        $problems .= $this->getListRow($status, $text);
                    }
                }
            }

            return $problems;
        };

        // First render the errors
        $problems  = $processResults($this->results, 'success');

        // Then render the successful checks
        $problems .= $processResults($this->results, 'error');

        $html = str_replace('%%BASE_URL%%', $baseUrlRelative, $html);
        $html = str_replace('%%THEME_URL%%', $themeUrl, $html);
        $html = str_replace('%%PROBLEMS_URL%%', $problemsUrl, $html);
        $html = str_replace('%%PROBLEMS%%', $problems, $html);

        echo $html;
        http_response_code(500);

        exit();


    }

    protected function getListRow($status, $text)
    {
        if ($status == 'error') {
            $icon = 'fa-times';
        } elseif ($status == 'info') {
            $icon = 'fa-info';
        } else {
            $icon = 'fa-check';
        }
        $output = "\n";
        $output .= '<li class="' . $status . ' clearfix"><i class="fa fa-fw '. $icon . '"></i><p>'. $text . '</p></li>';
        return $output;
    }

    protected function problemChecker()
    {
        $min_php_version = defined('GRAV_PHP_MIN') ? GRAV_PHP_MIN : '5.4.0';
        $problems_found = false;

        $essential_files = [
            'cache' => true,
            'logs' => true,
            'images' => true,
            'assets' => true,
            'system' => false,
            'user/data' => true,
            'user/pages' => false,
            'user/config' => false,
            'user/plugins/error' => false,
            'user/plugins' => false,
            'user/themes' => false,
            'vendor' => false
        ];

        if (version_compare(GRAV_VERSION, '0.9.27', ">=")) {
            $essential_files['backup'] = true;
            $backup_folder = ROOT_DIR . 'backup';
            // try to create backup folder if missing
            if (!file_exists($backup_folder)) {
                @mkdir($backup_folder, 0770);
            }
        }

        if (version_compare(GRAV_VERSION, '1.1.4', ">=")) {
            $essential_files['tmp'] = true;
            $tmp_folder = ROOT_DIR . 'tmp';
            // try to create tmp folder if missing
            if (!file_exists($tmp_folder)) {
                @mkdir($tmp_folder, 0770);
            }
        }

        // Perform some Apache checks
        if (strpos(php_sapi_name(), 'apache') !== false) {

            $require_apache_modules = ['mod_rewrite'];
            $apache_modules = apache_get_modules();

            $apache_status = [];

            foreach ($require_apache_modules as $module) {
                if (in_array($module, $apache_modules)) {
                    $apache_module_adjective = ' Apache module is enabled';
                    $apache_module_status = 'success';
                } else {
                    $problems_found = true;
                    $apache_module_adjective = ' Apache module is not installed or enabled';
                    $apache_module_status = 'error';
                }
                $apache_status[$module] = [$apache_module_status => $apache_module_adjective];
            }

            if (sizeof($apache_status) > 0) {
                $this->results['apache'] = $apache_status;
            }
        }

        // Check PHP version
        if (version_compare(phpversion(), $min_php_version, '<')) {
            $problems_found = true;
            $php_version_adjective = 'lower';
            $php_version_status = 'error';

        } else {
            $php_version_adjective = 'greater';
            $php_version_status = 'success';
        }
        $this->results['php'] = [$php_version_status => 'Your PHP version (' . phpversion() . ') is '. $php_version_adjective . ' than the minimum required: <b>' . $min_php_version . '</b>  - <a href="http://getgrav.org/blog/changing-php-requirements-to-5.5">Additional Information</a>'];

        // Check for GD library
        if (defined('GD_VERSION') && function_exists('gd_info')) {
            $gd_adjective = '';
            $gd_status = 'success';
        } else {
            $problems_found = true;
            $gd_adjective = 'not ';
            $gd_status = 'error';
        }
        $this->results['gd'] = [$gd_status => 'PHP GD (Image Manipulation Library) is '. $gd_adjective . 'installed'];

        // Check for PHP CURL library
        if (function_exists('curl_version')) {
            $curl_adjective = '';
            $curl_status = 'success';
        } else {
            $problems_found = true;
            $curl_adjective = 'not ';
            $curl_status = 'error';
        }
        $this->results['curl'] = [$curl_status => 'PHP Curl (Data Transfer Library) is '. $curl_adjective . 'installed'];

        // Check for PHP Open SSL library
        if (extension_loaded('openssl') && defined('OPENSSL_VERSION_TEXT')) {
            $ssl_adjective = '';
            $ssl_status = 'success';
        } else {
            $problems_found = true;
            $ssl_adjective = 'not ';
            $ssl_status = 'error';
        }
        $this->results['ssl'] = [$ssl_status => 'PHP OpenSSL (Secure Sockets Library) is '. $ssl_adjective . 'installed'];

        // Check for PHP XML library
        if (extension_loaded('xml')) {
            $xml_adjective = '';
            $xml_status = 'success';
        } else {
            $problems_found = true;
            $xml_adjective = 'not ';
            $xml_status = 'error';
        }
        $this->results['xml'] = [$xml_status => 'PHP XML Library is '. $xml_adjective . 'installed'];

        // Check for PHP MbString library
        if (extension_loaded('mbstring')) {
            $mbstring_adjective = '';
            $mbstring_status = 'success';
        } else {
            $problems_found = true;
            $mbstring_adjective = 'not ';
            $mbstring_status = 'error';
        }
        $this->results['mbstring'] = [$mbstring_status => 'PHP Mbstring (Multibyte String Library) is '. $mbstring_adjective . 'installed'];

        // Check Exif if enabled
        if ($this->grav['config']->get('system.media.auto_metadata_exif')) {
            if(extension_loaded('exif')) {
                $exif_adjective = '';
                $exif_status = 'success';
            } else {
                $problems_found = true;
                $exif_adjective = 'not ';
                $exif_status = 'error';
            }
            $this->results['exif'] = [$exif_status => 'PHP Exif (Exchangeable Image File Format) is '. $exif_adjective . 'installed'];
        }

        // Check for PHP Zip library
        if (extension_loaded('zip')) {
            $zip_adjective = '';
            $zip_status = 'success';
        } else {
            $problems_found = true;
            $zip_adjective = 'not ';
            $zip_status = 'error';
        }
        $this->results['zip'] = [$zip_status => 'PHP Zip extension is '. $zip_adjective . 'installed'];

        // Check for essential files & perms
        $file_problems = [];
        foreach ($essential_files as $file => $check_writable) {
            $file_path = ROOT_DIR . $file;
            $is_dir = false;
            if (!file_exists($file_path)) {
                $problems_found = true;
                $file_status = 'error';
                $file_adjective = 'does not exist';

            } else {
                $file_status = 'success';
                $file_adjective = 'exists';
                $is_writeable = is_writable($file_path);
                $is_dir = is_dir($file_path);

                if ($check_writable) {
                    if (!$is_writeable) {
                        $file_status = 'error';
                        $problems_found = true;
                        $file_adjective .= ' but is <b class="underline">not writeable</b>';
                    } else {
                        $file_adjective .= ' and <b class="underline">is writeable</b>';
                    }
                }
            }

            $file_problems[$file_path] = [$file_status => $file_adjective];

        }
        if (sizeof($file_problems) > 0) {
            $this->results['files'] = $file_problems;
        }

        return $problems_found;
    }
}
