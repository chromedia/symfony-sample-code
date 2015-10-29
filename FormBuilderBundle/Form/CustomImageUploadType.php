<?php
namespace YPKY\FormBuilderBundle\Form;

use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\AbstractType;
use YPKY\FormBuilderBundle\Form\Transformer\CustomFileTypeViewTransformer;

use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;

class CustomImageUploadType extends AbstractType
{

    private $viewTransformer;

    public function buildForm(FormBuilderInterface $builder, array $options)
    {   
        $builder->addViewTransformer($this->viewTransformer);
    }
    
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
         $defaults = array(
            'data_class' => null,
            'image_path' => null
        );
        

         $resolver->setDefaults($defaults);
    }   

    public function setViewTransformer(CustomFileTypeViewTransformer $transformer)
    {
        $this->viewTransformer = $transformer;
    }

    public function getParent()
    {
        return 'file';
    }
    
    public function getName()
    {
        return 'custom_image_file';
    }
}