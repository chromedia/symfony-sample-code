<?php 

/**
 * 
 * @author Adelbert Silla
 *
 */
namespace YPKY\FormBuilderBundle\Form\Transformer;

use Symfony\Component\Form\DataTransformerInterface;
use Symfony\Component\Form\Exception\TransformationFailedException;
use Doctrine\ORM\EntityManager;

class CustomFileTypeViewTransformer implements DataTransformerInterface
{
    public function transform($value)
    {

        if (strlen($value) === 0) {
            return '';
        }

        $source = $this->uploadPath.DIRECTORY_SEPARATOR.$value;

        return $source;
    }

    public function reverseTransform($value)
    { 
        return $value;
    }

    public function setUploadDirectory($uploadPath)
    {
        $this->uploadPath = $uploadPath;
    }
}