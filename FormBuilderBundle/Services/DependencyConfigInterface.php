<?php 
/**
 * 
 * @author Adelbert Silla
 *
 */
namespace YPKY\FormBuilderBundle\Services;

interface DependencyConfigInterface
{
    /**
     * Returns a multidimentional array
     * 
     * @return array
     */
    function getParentDependency();

    /**
     * Returns a multidimentional array
     * 
     * @return array
     */
    function getDependentsConfig();
}