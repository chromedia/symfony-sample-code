<?php 

namespace YPKY\FormBuilderBundle\Form\Extension;

use Symfony\Component\Form\AbstractTypeExtension;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

/**
 * Class FormTypeExtension
 * @package YPKY\FormBuilderBundle\Form\Extension
 */
class FormTypeExtension extends AbstractTypeExtension
{
    /**
     * Extends the form type which all other types extend
     *
     * @return string The name of the type being extended
     */
    public function getExtendedType()
    {
        return 'form';
    }

    /**
     * Add the extra row_attr option
     *
     * @param OptionsResolverInterface $resolver
     */
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'row_attr' => array(),
            'notes' => '',
            'helptext' => '',
            'is_global' => false,
            'row_inner_container_attr' => array(),
            'custom_render_options' => array()
        ));
    }

    /**
     * Pass the set row_attr options to the view
     *
     * @param FormView $view
     * @param FormInterface $form
     * @param array $options
     */
    public function buildView(FormView $view, FormInterface $form, array $options)
    {
         $view->vars['row_attr'] = $options['row_attr'];
         $view->vars['helptext'] = $options['helptext'];
         $view->vars['is_global'] = $options['is_global'];

         /**
          * @author  Farly Taboada
          */
         $renderOptions = $options['custom_render_options'];
         foreach ($renderOptions as $key => $value) {
            $view->vars[$key] = $value;
         }
    }
    
}