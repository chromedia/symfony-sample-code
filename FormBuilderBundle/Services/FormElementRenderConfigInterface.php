<?php 
/**
 * Interface for FormElementRenderConfig
 * 
 * @author Adelbert Silla
 *
 */
namespace YPKY\FormBuilderBundle\Services;

interface FormElementRenderConfigInterface
{
    function getRenderAs();
    
    function getWidgetSize();
    
    function getDisplayLabel();
    
    function getDisplaySubLabel();
    
    function getDisplayNote();
    
    function getDisplayHelptext();
    
    function getDisplayExample();
    
    function getDependentsConfig();
    
    function getStringRowStyle();
}