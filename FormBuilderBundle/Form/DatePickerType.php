<?php
namespace YPKY\FormBuilderBundle\Form;

use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\AbstractType;


class DatePickerType extends AbstractType
{   
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $defaults = array(
            'widget' => 'single_text',
            'input'  => 'string'
        );
 
        $resolver->setDefaults($defaults);
    }   

    public function getParent()
    {
        return 'text';
    }
    
    public function getName()
    {
        return 'date_picker';
    }
}