(function() {
    "use strict";

    angular.module("ui.grid.draggable-rows", ["ui.grid"])

        .constant("uiGridDraggableRowsConstants", {
            featureName: "draggableRows",
            ROW_OVER_CLASS: "ui-grid-draggable-row-over",
            publicEvents: {
                draggableRows: {
                    rowDragged: function(scope, draggedRow) {},
                    rowDropped: function(scope, droppedRow, target) {},
                    rowOverRow: function(scope, draggedRow, row) {},
                    rowEnterRow: function(scope, draggedRow, row) {},
                    rowLeavesRow: function(scope, draggedRow, row) {},
                    rowFinishDrag: function(scope) {}
                }
            }
        })

        .factory("uiGridDraggableRowsCommon", [function() {
            return {
                catchedRow: null
            };
        }])

        .service("uiGridDraggableRowsService", ["uiGridDraggableRowsConstants", function(uiGridDraggableRowsConstants) {
            this.initializeGrid = function(grid, $scope, $element) {
                grid.api.registerEventsFromObject(uiGridDraggableRowsConstants.publicEvents);

                grid.api.draggableRows.on.rowFinishDrag($scope, function() {
                    $element.find("." + uiGridDraggableRowsConstants.ROW_OVER_CLASS).removeClass(uiGridDraggableRowsConstants.ROW_OVER_CLASS);
                });
            };
        }])

        .service("uiGridDraggableRowService", ["uiGridDraggableRowsConstants", "uiGridDraggableRowsCommon", function (uiGridDraggableRowsConstants, uiGridDraggableRowsCommon) {
            this.prepareDraggableRow = function($scope, $element) {
                var grid = $scope.grid;
                var row = $element.get(0);

                var listeners = {
                    onDragOverEventListener: function (e) {
                        if (e.preventDefault) {
                            e.preventDefault();
                        }

                        e.dataTransfer.dropEffect = "move";
                        grid.api.draggableRows.raise.rowOverRow(uiGridDraggableRowsCommon.catchedRow, this);
                    },

                    onDragStartEventListener: function (e) {
                        uiGridDraggableRowsCommon.catchedRow = this;

                        this.style.opacity = "0.5";
                        e.dataTransfer.setData("text/plain", "start");

                        grid.api.draggableRows.raise.rowDragged(this);
                    },

                    onDragLeaveEventListener: function () {
                        this.style.opacity = "1";
                        this.classList.remove(uiGridDraggableRowsConstants.ROW_OVER_CLASS);

                        grid.api.draggableRows.raise.rowLeavesRow(uiGridDraggableRowsCommon.catchedRow, this);
                    },

                    onDragEnterEventListener: function() {
                        this.classList.add(uiGridDraggableRowsConstants.ROW_OVER_CLASS);

                        grid.api.draggableRows.raise.rowEnterRow(uiGridDraggableRowsCommon.catchedRow, this);
                    },

                    onDragEndEventListener: function () {
                        grid.api.draggableRows.raise.rowFinishDrag();
                    },

                    onDropEventListener: function (e) {
                        var catchedRow = uiGridDraggableRowsCommon.catchedRow;

                        if (e.stopPropagation) {
                            e.stopPropagation();
                        }

                        if(catchedRow === this) {
                            return false;
                        }

                        grid.api.draggableRows.raise.rowDropped(catchedRow, this);

                        e.preventDefault();
                    }
                };

                row.addEventListener("dragover", listeners.onDragOverEventListener, false);
                row.addEventListener("dragstart", listeners.onDragStartEventListener, false);
                row.addEventListener("dragleave", listeners.onDragLeaveEventListener, false);
                row.addEventListener("dragenter", listeners.onDragEnterEventListener, false);
                row.addEventListener("dragend", listeners.onDragEndEventListener, false);
                row.addEventListener("drop", listeners.onDropEventListener);
            };

        }])

        .directive("uiGridDraggableRow", ["uiGridDraggableRowService", function(uiGridDraggableRowService) {
            return {
                restrict: "ACE",
                scope: {
                    draggableId: "=",
                    grid: "="
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

        .directive("uiGridDraggableRows", ["uiGridDraggableRowsService", function (uiGridDraggableRowsService) {
            return {
                restrict: "A",
                replace: true,
                priority: 0,
                require: "uiGrid",
                scope: false,
                compile: function () {
                    return {
                        pre: function ($scope, $element, $attrs, uiGridCtrl) {
                            uiGridDraggableRowsService.initializeGrid(uiGridCtrl.grid, $scope, $element);
                        }
                    };
                }
            };
        }]);
}());
