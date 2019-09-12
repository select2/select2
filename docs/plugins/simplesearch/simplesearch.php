<?php
namespace Grav\Plugin;

use Grav\Common\Page\Collection;
use Grav\Common\Plugin;
use Grav\Common\Uri;
use Grav\Common\Page\Page;
use Grav\Common\Page\Types;
use Grav\Common\Taxonomy;
use Grav\Common\Utils;
use Grav\Common\Data\Data;
use Grav\Common\Config\Config;
use RocketTheme\Toolbox\Event\Event;

class SimplesearchPlugin extends Plugin
{
    /**
     * @var array
     */
    protected $query;

    /**
     * @var string
     */
    protected $query_id;

    /**
     * @var Collection
     */
    protected $collection;

    /**
     * @return array
     */
    public static function getSubscribedEvents()
    {
        return [
            'onPluginsInitialized' => ['onPluginsInitialized', 0],
            'onTwigTemplatePaths' => ['onTwigTemplatePaths', 0],
            'onGetPageTemplates' => ['onGetPageTemplates', 0],
        ];
    }

    /**
     * Add page template types. (for Admin plugin)
     */
    public function onGetPageTemplates(Event $event)
    {
        /** @var Types $types */
        $types = $event->types;
        $types->scanTemplates('plugins://simplesearch/templates');
    }


    /**
     * Add current directory to twig lookup paths.
     */
    public function onTwigTemplatePaths()
    {
        $this->grav['twig']->twig_paths[] = __DIR__ . '/templates';
    }

    /**
     * Enable search only if url matches to the configuration.
     */
    public function onPluginsInitialized()
    {
        if ($this->isAdmin()) {
            return;
        }

        $this->enable([
            'onPagesInitialized' => ['onPagesInitialized', 0],
            'onTwigSiteVariables' => ['onTwigSiteVariables', 0]
        ]);
    }


    /**
     * Build search results.
     */
    public function onPagesInitialized()
    {
        $page = $this->grav['page'];

        $route = null;
        if (isset($page->header()->simplesearch['route'])) {
            $route = $page->header()->simplesearch['route'];

            // Support `route: '@self'` syntax
            if ($route === '@self') {
                $route = $page->route();
                $page->header()->simplesearch['route'] = $route;
            }
        }

        // If a page exists merge the configs
        if ($page) {
            $this->config->set('plugins.simplesearch', $this->mergeConfig($page));
        }

        /** @var Uri $uri */
        $uri = $this->grav['uri'];
        $query = $uri->param('query') ?: $uri->query('query');
        $route = $this->config->get('plugins.simplesearch.route');

        // performance check for route
        if (!($route && $route == $uri->path())) {
            return;
        }

        // Explode query into multiple strings. Drop empty values
        $this->query = array_filter(array_filter(explode(',', $query), 'trim'), 'strlen');

        /** @var Taxonomy $taxonomy_map */
        $taxonomy_map = $this->grav['taxonomy'];
        $taxonomies = [];
        $find_taxonomy = [];

        $filters = (array) $this->config->get('plugins.simplesearch.filters');
        $operator = $this->config->get('plugins.simplesearch.filter_combinator', 'and');
        $new_approach = false;

        // if @none found, skip processing taxonomies
        $should_process = true;
        if (is_array($filters)) {
            $the_filter = reset($filters);

            if (is_array($the_filter)) {
                if (in_array(reset($the_filter), ['@none', 'none@'])) {
                    $should_process = false;
                }
            }
        }

        if (!$should_process || !$filters || $query === false || (count($filters) == 1 && !reset($filters))) {
            /** @var \Grav\Common\Page\Pages $pages */
            $pages = $this->grav['pages'];
            $this->collection = $pages->all();
        } else {

            foreach ($filters as $key => $filter) {
                // flatten item if it's wrapped in an array
                if (is_int($key)) {
                    if (is_array($filter)) {
                        $key = key($filter);
                        $filter = $filter[$key];
                    } else {
                        $key = $filter;
                    }
                }

                // see if the filter uses the new 'items-type' syntax
                if ($key === '@self' || $key === 'self@') {
                    $new_approach = true;
                } elseif ($key === '@taxonomy' || $key === 'taxonomy@') {
                    $taxonomies = $filter === false ? false : array_merge($taxonomies, (array) $filter);
                } else {
                    $find_taxonomy[$key] = $filter;
                }
            }

            if ($new_approach) {
                $params = $page->header()->content;
                $params['query'] = $this->config->get('plugins.simplesearch.query');
                $this->collection = $page->collection($params, false);
            } else {
                $this->collection = new Collection();
                $this->collection->append($taxonomy_map->findTaxonomy($find_taxonomy, $operator)->toArray());
            }
        }

        //Drop unpublished and unroutable pages
        $this->collection->published()->routable();

        //Check if user has permission to view page
        if($this->grav['config']->get('plugins.login.enabled')) {
            $this->collection = $this->checkForPermissions($this->collection);
        }
        $extras = [];

        if ($query) {
            foreach ($this->collection as $cpage) {
                foreach ($this->query as $query) {
                    $query = trim($query);

                    if ($this->notFound($query, $cpage, $taxonomies)) {
                        $this->collection->remove($cpage);
                        continue;
                    }

                    if ($cpage->modular()) {
                        $this->collection->remove($cpage);
                        $parent = $cpage->parent();
                        $extras[$parent->path()] = ['slug' => $parent->slug()];
                    }

                }
            }
        }

        if (!empty($extras)) {
            $this->collection->append($extras);
        }

        // use a configured sorting order if not already done
        if (!$new_approach) {
            $this->collection = $this->collection->order(
                $this->config->get('plugins.simplesearch.order.by'),
                $this->config->get('plugins.simplesearch.order.dir')
            );
        }

        // if page doesn't have settings set, create a page
        if (!isset($page->header()->simplesearch)) {
            // create the search page
            $page = new Page;
            $page->init(new \SplFileInfo(__DIR__ . '/pages/simplesearch.md'));

            // override the template is set in the config
            $template_override = $this->config->get('plugins.simplesearch.template');
            if ($template_override) {
                $page->template($template_override);
            }

            // fix RuntimeException: Cannot override frozen service "page" issue
            unset($this->grav['page']);

            $this->grav['page'] = $page;
        }
    }

    /**
     * Filter the pages, and return only the pages the user has access to.
     * Implementation based on Login Plugin authorizePage() function.
     */
    public function checkForPermissions($collection)
    {
        $user = $this->grav['user'];
        $returnCollection = new Collection();
        foreach ($collection as $page) {

            $header = $page->header();
            $rules = isset($header->access) ? (array)$header->access : [];

            if ($this->config->get('plugins.login.parent_acl')) {
                // If page has no ACL rules, use its parent's rules
                if (!$rules) {
                    $parent = $page->parent();
                    while (!$rules and $parent) {
                        $header = $parent->header();
                        $rules = isset($header->access) ? (array)$header->access : [];
                        $parent = $parent->parent();
                    }
                }
            }

            // Continue to the page if it has no ACL rules.
            if (!$rules) {
                $returnCollection[$page->path()] = ['slug' => $page->slug()];
            } else {
                // Continue to the page if user is authorized to access the page.
                foreach ($rules as $rule => $value) {
                    if (is_array($value)) {
                        foreach ($value as $nested_rule => $nested_value) {
                            if ($user->authorize($rule . '.' . $nested_rule) == $nested_value) {
                                $returnCollection[$page->path()] = ['slug' => $page->slug()];
                                break;
                            }
                        }
                    } else {
                        if ($user->authorize($rule) == $value) {
                            $returnCollection[$page->path()] = ['slug' => $page->slug()];
                            break;
                        }
                    }
                }
            }
        }
        return $returnCollection;
    }

    /**
     * Set needed variables to display the search results.
     */
    public function onTwigSiteVariables()
    {
        $twig = $this->grav['twig'];

        if ($this->query) {
            $twig->twig_vars['query'] = implode(', ', $this->query);
            $twig->twig_vars['search_results'] = $this->collection;
        }

        if ($this->config->get('plugins.simplesearch.built_in_css')) {
            $this->grav['assets']->add('plugin://simplesearch/css/simplesearch.css');
        }


        $this->grav['assets']->addJs('plugin://simplesearch/js/simplesearch.js', [ 'group' => 'bottom' ]);
    }

    private function matchText($haystack, $needle) {
        if ($this->config->get('plugins.simplesearch.ignore_accented_characters')) {
            setlocale(LC_ALL, 'en_US');
            try {
                $result = mb_stripos(iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $haystack), iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $needle));
            } catch (\Exception $e) {
                $result = mb_stripos($haystack, $needle);
            }
            setlocale(LC_ALL, '');
            return $result;
        } else {
            return mb_stripos($haystack, $needle);
        }
    }

    /**
     * @param $query
     * @param Page $page
     * @param $taxonomies
     * @return bool
     */
    private function notFound($query, $page, $taxonomies)
    {
        $searchable_types = ['title', 'content', 'taxonomy'];
        $results = true;
        $search_content = $this->config->get('plugins.simplesearch.search_content');

        foreach ($searchable_types as $type) {
            if ($type === 'title') {
                $result = $this->matchText(strip_tags($page->title()), $query) === false;
            } elseif ($type === 'taxonomy') {
                if ($taxonomies === false) {
                    continue;
                }
                $page_taxonomies = $page->taxonomy();
                $taxonomy_match = false;
                foreach ((array) $page_taxonomies as $taxonomy => $values) {
                    // if taxonomies filter set, make sure taxonomy filter is valid
                    if (is_array($taxonomies) && !empty($taxonomies) && !in_array($taxonomy, $taxonomies)) {
                        continue;
                    }

                    $taxonomy_values = implode('|',$values);
                    if ($this->matchText($taxonomy_values, $query) !== false) {
                        $taxonomy_match = true;
                        break;
                    }
                }
                $result = !$taxonomy_match;
            } else {
                if ($search_content == 'raw') {
                    $content = $page->rawMarkdown();
                } else {
                    $content = $page->content();
                }
                $result = $this->matchText(strip_tags($content), $query) === false;
            }
            $results = $results && $result;
            if ($results === false ) {
                break;
            }
        }
        return $results;
    }
}
