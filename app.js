var app = angular.module('listloader.app', []);


app.directive('listLoader', function() {
	return {
		restrict: "A",
		template: "<div class=\"listLoader\">" +
            "<div ng-repeat=\"line in lines track by $index\">{{line.text}}" +
            "<span ng-hide=\"line.complete\" style=\"float: right\">loading</span></div>" +
            "<div class=\"listInput\" contenteditable></div>" +
            "</div>",
		scope: {
			lineaction: '=action',
		},
		controller: function($scope, $q) { 
            $scope.lines = []; 
            $scope.doAction = function(line) {
                var deferred = $q.defer();

                setTimeout(function() {
                    line.output = $scope.lineaction(line.input);
                    deferred.resolve(line);
                },0);

                return deferred.promise;

            }
        },
		link: function(scope, element, attrs) {
            var addLine = function(text) {
                var line = {
                    text: text,
                    input: text, 
                    output: '',
                    complete: false,
                };

                scope.$apply(function() {
                    // push a new line object on to lines array
    				scope.lines.push(line);
    			});
                
                scope.doAction(line).then(function(tline) {
                    tline.text = tline.output;
                    tline.complete = true;
                });
            };

            var inputDiv = element[0].firstChild.lastChild;
            inputDiv.onkeydown = inputDiv.onkeypress = function(event) {
                if (event.which === 13) {
                    addLine(event.srcElement.innerText);
                    // clear the contenteditable div for next entry
                    event.srcElement.innerText = '';
                    event.preventDefault();                 
				}
			}

			// scope.$watch('lines', function(newVal, oldVal) { }, true);
		}
	}
})

app.controller('listloader.ctrl', function($scope) {
	$scope.myAction = function(line) {
        for (var i=0; i<1000000000; i++) {
            k = i+1;
        }
       return "Converted input [" + line + "] to this output";
	}
})


