<?php

namespace YPKY\FormBuilderBundle\Form\Type\DataTransformer;

use Symfony\Component\Form\DataTransformerInterface;
use Symfony\Component\Form\Exception\TransformationFailedException;


class DateTransformer implements DataTransformerInterface
{
    /**
     *
     * @param  
     * @return string
     */
    public function transform($dateString)
    {
        if ( (null === $dateString) || empty($dateString) ) {
            return null;
        }

        $date = new \DateTime($dateString);

        return $date->format('m/d/Y');
    }

    /**
     *
     * 
     */
    public function reverseTransform($dateString)
    {

        if ($dateString === null || $dateString === '') {
            return '';
        }

        $date = new \DateTime($dateString);

        return $date->format('Y-m-d');
    }
}