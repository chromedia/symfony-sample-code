<?php

namespace YPKY\FormBuilderBundle\Form\Type\DataTransformer;

use Symfony\Component\Form\DataTransformerInterface;
use Symfony\Component\Form\Exception\TransformationFailedException;


class MultipleSelectTransformer implements DataTransformerInterface
{
    /**
     *
     * @param  string
     * @return array
     */
    public function transform($selectedOptionsJsonEncoded)
    {
        if ('' == $selectedOptionsJsonEncoded) {
            return array();
        }

        return json_decode($selectedOptionsJsonEncoded, true);
    }

    /**
     * 
     * @param array
     * @return string
     */
    public function reverseTransform($selectedOptions)
    {
        if ( (null === $selectedOptions) || empty($selectedOptions) ) {
            return '';
        }

        return json_encode($selectedOptions);
    }
}