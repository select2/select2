<?php
namespace Grav\Plugin;

use \Grav\Common\Plugin;
use \Grav\Common\Grav;
use \Grav\Common\Page\Page;

class HighlightPlugin extends Plugin
{
    /**
     * @return array
     */
    public static function getSubscribedEvents()
    {
        return [
            'onPageInitialized' => ['onPageInitialized', 0]
        ];
    }

    /**
     * Initialize configuration
     */
    public function onPageInitialized()
    {
        if ($this->isAdmin()) {
            $this->active = false;
            return;
        }

        $defaults = (array) $this->config->get('plugins.highlight');

        /** @var Page $page */
        $page = $this->grav['page'];
        if (isset($page->header()->highlight)) {
            $this->config->set('plugins.highlight', array_merge($defaults, $page->header()->highlight));
        }
        if ($this->config->get('plugins.highlight.enabled')) {
            $this->enable([
                'onTwigSiteVariables' => ['onTwigSiteVariables', 0]
            ]);
        }
    }

    /**
     * if enabled on this page, load the JS + CSS theme.
     */
    public function onTwigSiteVariables()
    {
        $init = "$(document).ready(function() {\n";
        $init .= "$('pre code').each(function(i, block) {\n";
        $init .= "hljs.highlightBlock(block);\n";
        if ($this->config->get('plugins.highlight.lines')) {
            $init .= "hljs.initLineNumbersOnLoad();\n";
        }
        $init .= "});\n";
        $init .= "});\n";
        $theme = $this->config->get('plugins.highlight.theme') ?: 'default';
        $this->grav['assets']->addCss('plugin://highlight/css/'.$theme.'.css');
        $this->grav['assets']->addJs('plugin://highlight/js/highlight.pack.js');
        if ($this->config->get('plugins.highlight.lines')) {
            $this->grav['assets']->addJs('plugin://highlight/js/highlightjs-line-numbers.min.js');
        }
        $this->grav['assets']->addInlineJs($init);
    }
}
