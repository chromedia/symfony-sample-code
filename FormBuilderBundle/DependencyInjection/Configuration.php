<?php

namespace YPKY\FormBuilderBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;
use Symfony\Component\Config\Definition\Builder\ArrayNodeDefinition;

/**
 * This is the class that validates and merges configuration from your app/config files
 *
 * To learn more see {@link http://symfony.com/doc/current/cookbook/bundles/extension.html#cookbook-bundles-extension-config-class}
 */
class Configuration implements ConfigurationInterface
{
    /**
     * {@inheritDoc}
     */
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder();
        $rootNode = $treeBuilder->root('form_builder');

        // Here you should define the parameters that are allowed to
        // configure your bundle. See the documentation linked above for
        // more information on that topic.

        $this->addFormHtmlElements($rootNode);

        $this->addRenderConfigProperties($rootNode);

        $this->addDefaultRenderConfig($rootNode);

        $this->addRenderConfigWidgetSizes($rootNode);

        $this->addRenderConfigDisplayType($rootNode);

        $this->addFormWidgetDefaultConstraints($rootNode);

//        $this->addConfigJs($rootNode);

        return $treeBuilder;
    }
    
    private function addFormHtmlElements(ArrayNodeDefinition $node)
    {
        $formElement = $node->children()
            ->variableNode('form_html_elements')
            ->defaultValue(array())
        ->end();
    }
    
    private function addRenderConfigProperties(ArrayNodeDefinition $node)
    {
        $formElement = $node->children()
            ->variableNode('render_config_properties')
            ->defaultValue(array())
        ->end();
    }

    private function addDefaultRenderConfig(ArrayNodeDefinition $node)
    {
        $formElement = $node->children()
            ->variableNode('default_render_config')
            ->defaultValue(array())
        ->end();
    }
    
    private function addRenderConfigWidgetSizes(ArrayNodeDefinition $node)
    {
        $formElement = $node->children()
            ->variableNode('render_config_widget_sizes')
            ->defaultValue(array())
        ->end();
    }
    
    private function addRenderConfigDisplayType(ArrayNodeDefinition $node)
    {
        $formElement = $node->children()
            ->variableNode('render_config_display_types')
            ->defaultValue(array())
        ->end();
    }

    private function addConfigJs(ArrayNodeDefinition $node)
    {
        $formElement = $node->children()
            ->arrayNode('config_js')
            ->addDefaultsIfNotSet(array())
        ->end();
    }

    private function addFormWidgetDefaultConstraints(ArrayNodeDefinition $node)
    {
        $formElement = $node->children()
            ->variableNode('form_widget_default_constaints')
            ->defaultValue(array())
        ->end();
    }
}
