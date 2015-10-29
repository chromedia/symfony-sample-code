<?php
namespace YPKY\FormBuilderBundle\Form;

use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\AbstractType;
use YPKY\FormBuilderBundle\Form\Transformer\CustomFileTypeViewTransformer;
use Symfony\Component\Form\FormView;
use Symfony\Component\Form\FormInterface;
use YPKY\ProductBundle\Entity\FormElement;


class CustomFormElementType extends AbstractType
{   
    const ALIAS = 'custom_form_element';

    const SEPARATOR_ELEMENT = '<hr>'; 

    
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $defaults = array(
            'html_element' => true,
            'label' => false,
            'mapped' => false
        );
        
        $resolver->setDefaults($defaults);
    }   

    /**
     * Pass the image URL to the view
     *
     * @param FormView $view
     * @param FormInterface $form
     * @param array $options
     */
    public function buildView(FormView $view, FormInterface $form, array $options)
    {
        $formElement = $options['data'];
        $view->vars['html_element'] = true; 
        if(!$formElement) {
            $view->vars['value'] = null;
        } else {
            $view->vars['value'] = $this->getElementValue($formElement);
        }        
    }

    public function getName()
    {
        return self::ALIAS;
    }

    private function getElementValue(FormElement $formElement)
    {
        $metadata = json_decode($formElement->getWidgetMetadata(), true);
        $value = '';
        
        if (isset($metadata['widgetElem'])) {
            $elem = $metadata['widgetElem'];

            $value = $elem;

            if($elem != self::SEPARATOR_ELEMENT)
                $value = $elem . $formElement->getText() . $this->closeTag($elem);
        }
        
        return $value;
    }
    
    private function closeTag($elem)
    {
        return '</' . substr($elem, 1);
    }
}