<?php

namespace YPKY\FormBuilderBundle\Twig;

class NumberToRomanTwigExtension extends \Twig_Extension
{
    public function getFunctions()
    {
        return array(
            'number_to_roman' => new \Twig_Function_Method($this, 'numberToRoman')
        );
    }
    

    function numberToRoman($num)
    {
        // Make sure that we only use the integer portion of the value
        $n = intval($num);
        $result = '';
    
        // Declare a lookup array that we will use to traverse the number:
        $lookup = array('M' => 1000, 'CM' => 900, 'D' => 500, 'CD' => 400,
                'C' => 100, 'XC' => 90, 'L' => 50, 'XL' => 40,
                'X' => 10, 'IX' => 9, 'V' => 5, 'IV' => 4, 'I' => 1);
    
        foreach ($lookup as $roman => $value)
        {
            // Determine the number of matches
            $matches = intval($n / $value);
    
            // Store that many characters
            $result .= str_repeat($roman, $matches);
    
            // Substract that from the number
            $n = $n % $value;
        }

        // The Roman numeral should be built, return it
        return $result;
    }

    public function getName()
    {
        return 'numberToRoman';
    }    
}