<?php 
/**
 * FormElementRenderConfig Class
 * 
 * @author Adelbert Silla
 *
 */
namespace YPKY\FormBuilderBundle\Services;

class FormElementRenderConfig implements FormElementRenderConfigInterface, DependencyConfigInterface
{
    private $renderConfig;

    function __construct($renderConfig = array())
    {
        $this->renderConfig = $renderConfig;
    }

    function getRenderAs()
    {
        return isset($this->renderConfig['render_as']) ? $this->renderConfig['render_as'] : 'block';
    }

    function getWidgetSize()
    {
        return isset($this->renderConfig['widget_size']) ? $this->renderConfig['widget_size'] : '90%';
    }

    function getDisplayLabel()
    {
        return isset($this->renderConfig['display_label']) ? $this->renderConfig['display_label'] : true;
    }

    function getDisplaySubLabel()
    {
        return isset($this->renderConfig['display_sublabel']) ? $this->renderConfig['display_sublabel'] : false;
    }

    function getDisplayNote()
    {
        return isset($this->renderConfig['display_note']) ? $this->renderConfig['display_note'] : false;
    }

    function getDisplayHelptext()
    {
        return isset($this->renderConfig['display_helptext']) ? $this->renderConfig['display_helptext'] : true;
    }

    function getDisplayExample()
    {
        return isset($this->renderConfig['display_example']) ? $this->renderConfig['display_example'] : false;
    }

    function getStringRowStyle()
    {
        return 'display: '. $this->getRenderAs() . ';'; 
    }

    function getDependentsConfig()
    {
        return isset($this->renderConfig['dependents_config']) ? $this->renderConfig['dependents_config'] : null;
    }

    function getParentDependency()
    {
        return isset($this->renderConfig['parent_dependency']) ? $this->renderConfig['parent_dependency'] : null;
    }
}