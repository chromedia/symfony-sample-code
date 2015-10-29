<?php 

namespace YPKY\FormBuilderBundle\Services;

class FormElementRenderConfigParser
{
    private $renderConfigProperties;
    

    public function setRenderConfigProperties(array $renderConfigProperties)
    {
        $this->renderConfigProperties = $renderConfigProperties;
    }
    
    public function getRenderConfigProperties()
    {
        return $this->renderConfigProperties;
    }

    /**
     * Parse JSON render config
     *  
     * @param string $renderConfig
     * @return \YPKY\FormBuilderBundle\Services\FormElementRenderConfig
     */
    public function parse($renderConfig = '')
    {
        $renderConfig = json_decode($renderConfig, true);

        return new FormElementRenderConfig($renderConfig);
    }
}