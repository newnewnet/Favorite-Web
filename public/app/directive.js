angular.module('directive', [])
.directive('scroller', function ($window) {
  	return function(scope, elm, attr) {
	    var raw = elm[0];
	    
	    elm.bind('scroll', function() {
	        if (raw.scrollTop + raw.offsetHeight >= (raw.scrollHeight)) {
	          scope.$apply(attr.scroller);
	        }
	    });
	};
})
.directive('httpPrefix', function() 
{
	return {
	    restrict: 'A',
	    require: 'ngModel',
	    link: function(scope, element, attrs, controller) {
	        function ensureHttpPrefix(value) {
	            // Need to add prefix if we don't have http:// prefix already AND we don't have part of it
	            if(value && !/^(https?):\/\//i.test(value)
	               && 'http://'.indexOf(value) === -1) {
	                controller.$setViewValue('http://' + value);
	                controller.$render();
	                return 'http://' + value;
	            }
	            else
	                return value;
	        }
	        controller.$formatters.push(ensureHttpPrefix);
	        controller.$parsers.splice(0, 0, ensureHttpPrefix);
	    }
	};
});