<?php
namespace Grav\Plugin;

use Grav\Common\Grav;

class Breadcrumbs
{

    /**
     * @var array
     */
    protected $breadcrumbs;
    protected $config;

    /**
     * @param $config
     */
    public function __construct($config)
    {
        $this->config = $config;
    }

    /**
     * Get all items in breadcrumbs.
     *
     * @return array
     */
    public function get()
    {
        if (!$this->breadcrumbs) {
            $this->build();
        }
        return $this->breadcrumbs;
    }

    /**
     * Build breadcrumbs.
     *
     * @internal
     */
    protected function build()
    {
        $hierarchy = array();
        $grav = Grav::instance();
        $current = $grav['page'];

        while ($current && !$current->root()) {
            $hierarchy[$current->url()] = $current;
            $current = $current->parent();
        }

        // Page cannot be routed.
        if (!$current) {
            $this->breadcrumbs = array();
            return;
        }

        if ($this->config['include_home']) {
            $home = $grav['pages']->dispatch('/');
            if ($home && !array_key_exists($home->url(), $hierarchy)) {
                $hierarchy[] = $home;
            }
        }


        $this->breadcrumbs = array_reverse($hierarchy);
    }
}
