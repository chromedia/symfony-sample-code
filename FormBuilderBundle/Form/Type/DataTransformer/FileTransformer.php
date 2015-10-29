<?php

namespace YPKY\FormBuilderBundle\Form\Type\DataTransformer;

use Symfony\Component\Form\DataTransformerInterface;
use Symfony\Component\Form\Exception\TransformationFailedException;
use Doctrine\Common\Persistence\ObjectManager;

class FileTransformer implements DataTransformerInterface
{
 
    /**
     * @return string
     */
    public function transform($object)
    {
        if ( (null === $object) || empty($object) ) {
            return '';
        }
        $object;
        // return $this->uploadPath. DIRECTORY_SEPARATOR .$object->getAnswer();
    }

    /**
     * 
     * @return file source
     * 
     */
    public function reverseTransform($value)
    {
        if ($value === null) {
            return '';
        }

        return $value;
        // return $this->uploadPath. DIRECTORY_SEPARATOR .$value;
    }

    public function setUploadPath($uploadPath)
    {
        $this->uploadPath = $uploadPath;
    }
}