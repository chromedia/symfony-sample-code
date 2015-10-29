<?php
namespace YPKY\FormBuilderBundle\Form\Extension;

use Symfony\Component\Form\AbstractTypeExtension;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\Form\FormInterface;

class CustomImageFileTypeExtension extends AbstractTypeExtension
{
    public function getExtendedType()
    {
        return 'custom_image_file';
    }
    
    /**
     * Add the image_path option
     *
     * @param OptionsResolverInterface $resolver
     */
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setOptional(array('image_path'));
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

        $view->vars['image_url'] = null;
        $view->vars['file'] = null;

        if (array_key_exists('image_path', $options)) {
            // $data = $form->getData();
    
            $data = $form->getViewData();
            $imageUrl = $data;

            $view->vars['file'] = $form->getNormData();

            // if (null !== $parentData) {
            //     $accessor = PropertyAccess::createPropertyAccessor();
            //     $imageUrl = $accessor->getValue($parentData, $options['image_path']);
            // } else {
            //     $imageUrl = null;
            // }
    
            // set an "image_url" variable that will be available when rendering this field
            $view->vars['image_url'] = $imageUrl;
        }
    }
}