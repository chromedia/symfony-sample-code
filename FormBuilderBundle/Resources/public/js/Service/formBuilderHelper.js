formBuilderApp.service('FormBuilderHelper', function() {

	var self = this;

    self.numberToRoman = function(num)
    {
        // Make sure that we only use the integer portion of the value
        num = parseInt(num);
        var result = '';

        // Declare a lookup array that we will use to traverse the number:
        var lookup = {
            'M': 1000, 'CM': 900, 'D': 500, 'CD': 400, 'C': 100,
            'XC': 90, 'L': 50, 'XL': 40, 'X': 10,
            'IX': 9, 'V': 5, 'IV': 4, 'I': 1
        };

        var matches = 0;
        for (key in lookup)
        {
            // Determine the number of matches
            matches = parseInt(num / lookup[key]);

            // Store that many characters
            result += self.strRepeat(key, matches);

            // Substract that from the number
            num = num % lookup[key];
        }

        // The Roman numeral should be built, return it
        return result;
    };

    self.strRepeat = function(string, count)
    {
        var finalString = '';
        for(var i = 0; i < count; i++) {
            finalString += string;
        }

        return finalString;
    };

    return self;
});