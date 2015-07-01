(function() {
    'use strict';

    angular.module('ui.grid.draggable-rows', ['ui.grid'])

    .constant('uiGridDraggableRowsConstants', {
        featureName: 'draggableRows',
        ROW_OVER_CLASS: 'ui-grid-draggable-row-over',
        ROW_OVER_ABOVE_CLASS: 'ui-grid-draggable-row-over--above',
        ROW_OVER_BELOW_CLASS: 'ui-grid-draggable-row-over--below',
        POSITION_ABOVE: 'above',
        POSITION_BELOW: 'below',
        publicEvents: {
            draggableRows: {
                rowDragged: function(scope, draggedRow) {},
                rowDropped: function(scope, droppedRow, target, position) {},
                rowOverRow: function(scope, draggedRow, row) {},
                rowEnterRow: function(scope, draggedRow, row) {},
                rowLeavesRow: function(scope, draggedRow, row) {},
                rowFinishDrag: function(scope) {}
            }
        }
    })

    .factory('uiGridDraggableRowsCommon', [function() {
        return {
            draggedRow: null,
            position: null,
            fromIndex: null,
            toIndex: null
        };
    }])

    .service('uiGridDraggableRowsService', ['uiGridDraggableRowsConstants', function(uiGridDraggableRowsConstants) {
        this.initializeGrid = function(grid, $scope, $element) {
            grid.api.registerEventsFromObject(uiGridDraggableRowsConstants.publicEvents);

            grid.api.draggableRows.on.rowFinishDrag($scope, function() {
                angular.forEach($element[0].querySelectorAll('.' + uiGridDraggableRowsConstants.ROW_OVER_CLASS), function(row) {
                    row.classList.remove(uiGridDraggableRowsConstants.ROW_OVER_CLASS);
                    row.classList.remove(uiGridDraggableRowsConstants.ROW_OVER_ABOVE_CLASS);
                    row.classList.remove(uiGridDraggableRowsConstants.ROW_OVER_BELOW_CLASS);
                });
            });
        };
    }])

    .service('uiGridDraggableRowService', ['uiGridDraggableRowsConstants', 'uiGridDraggableRowsCommon', function(uiGridDraggableRowsConstants, uiGridDraggableRowsCommon) {
        var move = function(from, to) {
            /*jshint validthis: true */
            this.splice(to, 0, this.splice(from, 1)[0]);
        };

        this.prepareDraggableRow = function($scope, $element) {
            var grid = $scope.grid;
            var row = $element[0];

            var listeners = {
                onDragOverEventListener: function(e) {
                    if (e.preventDefault) {
                        e.preventDefault();
                    }

                    var dataTransfer = e.dataTransfer || e.originalEvent.dataTransfer;
                    dataTransfer.effectAllowed = 'copyMove';
                    dataTransfer.dropEffect = 'move';

                    var offset = e.offsetY || e.layerY || (e.originalEvent ? e.originalEvent.offsetY : 0);

                    $element.addClass(uiGridDraggableRowsConstants.ROW_OVER_CLASS);

                    if (offset < this.offsetHeight / 2) {
                        uiGridDraggableRowsCommon.position = uiGridDraggableRowsConstants.POSITION_ABOVE;

                        $element.removeClass(uiGridDraggableRowsConstants.ROW_OVER_BELOW_CLASS);
                        $element.addClass(uiGridDraggableRowsConstants.ROW_OVER_ABOVE_CLASS);

                    } else {
                        uiGridDraggableRowsCommon.position = uiGridDraggableRowsConstants.POSITION_BELOW;

                        $element.removeClass(uiGridDraggableRowsConstants.ROW_OVER_ABOVE_CLASS);
                        $element.addClass(uiGridDraggableRowsConstants.ROW_OVER_BELOW_CLASS);
                    }

                    grid.api.draggableRows.raise.rowOverRow(uiGridDraggableRowsCommon.draggedRow, this);
                },

                onDragStartEventListener: function(e) {
                    this.style.opacity = '0.5';

                    uiGridDraggableRowsCommon.draggedRow = this;

                    uiGridDraggableRowsCommon.fromIndex = $scope.grid.options.data.indexOf($scope.$parent.$parent.row.entity);

                    grid.api.draggableRows.raise.rowDragged(this);
                },

                onDragLeaveEventListener: function() {
                    this.style.opacity = '1';

                    this.classList.remove(uiGridDraggableRowsConstants.ROW_OVER_CLASS);
                    this.classList.remove(uiGridDraggableRowsConstants.ROW_OVER_ABOVE_CLASS);
                    this.classList.remove(uiGridDraggableRowsConstants.ROW_OVER_BELOW_CLASS);

                    grid.api.draggableRows.raise.rowLeavesRow(uiGridDraggableRowsCommon.draggedRow, this);
                },

                onDragEnterEventListener: function() {
                    grid.api.draggableRows.raise.rowEnterRow(uiGridDraggableRowsCommon.draggedRow, this);
                },

                onDragEndEventListener: function() {
                    grid.api.draggableRows.raise.rowFinishDrag();
                },

                onDropEventListener: function(e) {
                    var draggedRow = uiGridDraggableRowsCommon.draggedRow;

                    if (e.stopPropagation) {
                        e.stopPropagation();
                    }

                    if (e.preventDefault) {
                        e.preventDefault();
                    }

                    if (draggedRow === this) {
                        return false;
                    }

                    uiGridDraggableRowsCommon.toIndex = $scope.grid.options.data.indexOf($scope.$parent.$parent.row.entity);

                    var newIndex;

                    if (uiGridDraggableRowsCommon.position === uiGridDraggableRowsConstants.POSITION_ABOVE) {
                        if (uiGridDraggableRowsCommon.fromIndex < uiGridDraggableRowsCommon.toIndex) {
                            newIndex = uiGridDraggableRowsCommon.toIndex - 1;
                        } else {
                            newIndex = uiGridDraggableRowsCommon.toIndex;
                        }
                    } else {
                        if (uiGridDraggableRowsCommon.fromIndex < uiGridDraggableRowsCommon.toIndex) {
                            newIndex = uiGridDraggableRowsCommon.toIndex;
                        } else {
                            newIndex = uiGridDraggableRowsCommon.toIndex + 1;
                        }
                    }

                    $scope.$apply(function() {
                        move.apply($scope.grid.options.data, [uiGridDraggableRowsCommon.fromIndex, newIndex]);
                    });

                    grid.api.draggableRows.raise.rowDropped(draggedRow, this, uiGridDraggableRowsCommon.position);

                    e.preventDefault();
                }
            };

            row.addEventListener('dragover', listeners.onDragOverEventListener, false);
            row.addEventListener('dragstart', listeners.onDragStartEventListener, false);
            row.addEventListener('dragleave', listeners.onDragLeaveEventListener, false);
            row.addEventListener('dragenter', listeners.onDragEnterEventListener, false);
            row.addEventListener('dragend', listeners.onDragEndEventListener, false);
            row.addEventListener('drop', listeners.onDropEventListener);
        };
    }])

    .directive('uiGridDraggableRow', ['uiGridDraggableRowService', function(uiGridDraggableRowService) {
        return {
            restrict: 'ACE',
            scope: {
                draggableId: '@',
                grid: '='
            },
            compile: function() {
                return {
                    pre: function($scope, $element) {
                        uiGridDraggableRowService.prepareDraggableRow($scope, $element);
                    }
                };
            }
        };
    }])

    .directive('uiGridDraggableRows', ['uiGridDraggableRowsService', function(uiGridDraggableRowsService) {
        return {
            restrict: 'A',
            replace: true,
            priority: 0,
            require: 'uiGrid',
            scope: false,
            compile: function() {
                return {
                    pre: function($scope, $element, $attrs, uiGridCtrl) {
                        uiGridDraggableRowsService.initializeGrid(uiGridCtrl.grid, $scope, $element);
                    }
                };
            }
        };
    }]);
}());
