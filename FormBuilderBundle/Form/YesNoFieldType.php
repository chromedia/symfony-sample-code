<?php
namespace YPKY\FormBuilderBundle\Form;

use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\AbstractType;


class YesNoFieldType extends AbstractType
{   
    // TODO: Override rendering if you want yes no options be in same line
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $options = array('Yes', 'No');

        $defaults = array(
            'expanded' => true,
            'multiple' => false,
            'choices'  => array_combine($options, $options)
        );
 
        $resolver->setDefaults($defaults);
    }   

    public function getParent()
    {
        return 'choice';
    }
    
    public function getName()
    {
        return 'yes_no_widget';
    }
}