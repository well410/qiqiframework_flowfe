/*
 * @Author: Shiwu
 * @Description: 收起和展开 Combo
 */
import {each, isString} from "@antv/util";
import {traverseTree} from "@antv/g6/es/util/graphic";

var DEFAULT_TRIGGER = 'dblclick';
var ALLOW_EVENTS = ['click', 'dblclick'];

function collapseExpandCombo(graph,combo) {
  if (isString(combo)) {
    combo = graph.findById(combo);
  }

  if (combo.getType && combo.getType() !== 'combo') return;
  var comboModel = combo.getModel(); // if one ancestor combo of the combo is collapsed, it should not be collapsed or expanded

  var parentItem = graph.findById(comboModel.parentId);

  while (parentItem) {
    var parentModel = parentItem.getModel();

    if (parentModel.collapsed) {
      console.warn("Fail to expand the combo since it's ancestor combo is collapsed.");
      parentItem = undefined;
      return;
    }

    parentItem = graph.findById(parentModel.parentId);
  }

  var collapsed = comboModel.collapsed; // 该群组已经处于收起状态，需要展开

  if (collapsed) {
    expandCombo(graph,combo);
  } else {
    collapseCombo(graph,combo);
  }

  graph.updateCombo(combo);
}

function expandCombo (graph, combo) {
  var _this = graph;

  if (isString(combo)) {
    combo = graph.findById(combo);
  }

  if (!combo || combo.getType && combo.getType() !== 'combo') {
    console.warn('The combo to be collapsed does not exist!');
    return;
  }

  var comboModel = combo.getModel();
  var itemController = graph.get('itemController');
  itemController.expandCombo(combo);
  comboModel.collapsed = false; // add virtual edges

  var edges = graph.getEdges().concat(graph.get('vedges')); // find all the descendant nodes and combos

  var cnodes = [];
  var ccombos = [];
  var comboTrees = graph.get('comboTrees');
  var found = false;
  var brothers = {};
  comboTrees && comboTrees.forEach(function (ctree) {
    brothers[ctree.id] = ctree;
  });
  comboTrees && comboTrees.forEach(function (ctree) {
    if (found) return; // if the combo is found, terminate

    traverseTree(ctree, function (subTree) {
      if (found && brothers[subTree.id]) {
        return false;
      }

      if (comboModel.parentId === subTree.id) {
        brothers = {};
        subTree.children.forEach(function (child) {
          brothers[child.id] = child;
        });
      } else if (comboModel.id === subTree.id) {
        found = true;
      }

      if (found) {
        var item = _this.findById(subTree.id);

        if (item && item.getType && item.getType() === 'combo') {
          cnodes = cnodes.concat(item.getNodes());
          ccombos = ccombos.concat(item.getCombos());
        }
      }

      return true;
    });
  });
  var edgeWeightMap = {};
  var addedVEdges = {};
  edges.forEach(function (edge) {
    if (edge.isVisible() && !edge.getModel().isVEdge) return;
    var source = edge.getSource();
    var target = edge.getTarget();
    try {
      var sourceId = source.get('id');
      var targetId = target.get('id');

      if ((cnodes.includes(source) || ccombos.includes(source)) && !cnodes.includes(target) && !ccombos.includes(target) || sourceId === comboModel.id) {
        // the source is in the combo, the target is not
        // ignore the virtual edges

        if (edge.getModel().isVEdge) {
          _this.removeItem(edge, false);

          return;
        }

        var targetModel = target.getModel(); // find the nearest visible ancestor

        while (!target.isVisible()) {
          target = _this.findById(targetModel.comboId || targetModel.parentId);

          if (!target || !targetModel.parentId && !targetModel.comboId) {
            return; // if all the ancestors of the oppsite are all hidden, ignore the edge
          }

          targetModel = target.getModel();
        }

        targetId = targetModel.id;
        var sourceModel = source.getModel(); // find the nearest visible ancestor

        while (!source.isVisible()) {
          source = _this.findById(sourceModel.comboId || sourceModel.parentId);

          if (!source || !sourceModel.parentId && !sourceModel.comboId) {
            return; // if all the ancestors of the oppsite are all hidden, ignore the edge
          }

          if (sourceModel.comboId === comboModel.id || sourceModel.parentId === comboModel.id) {
            break; // if the next ancestor is the combo, break the while
          }

          sourceModel = source.getModel();
        }

        sourceId = sourceModel.id;

        if (targetId) {
          var vedgeId = sourceId + "-" + targetId; // update the width of the virtual edges, which is the sum of merged actual edges
          // be attention that the actual edges with same endpoints but different directions will be represented by two different virtual edges

          if (edgeWeightMap[vedgeId]) {
            edgeWeightMap[vedgeId] += edge.getModel().size || 1;

            _this.updateItem(addedVEdges[vedgeId], {
              size: edgeWeightMap[vedgeId]
            }, false);

            return;
          }

          var vedge = _this.addItem('vedge', {
            source: sourceId,
            target: targetId,
            isVEdge: true
          }, false);

          edgeWeightMap[vedgeId] = edge.getModel().size || 1;
          addedVEdges[vedgeId] = vedge;
        }
      } else if (!cnodes.includes(source) && !ccombos.includes(source) && (cnodes.includes(target) || ccombos.includes(target)) || targetId === comboModel.id) {
        // the target is in the combo, the source is not
        // ignore the virtual edges
        if (edge.getModel().isVEdge) {
          _this.removeItem(edge, false);

          return;
        }

        var sourceModel = source.getModel(); // find the nearest visible ancestor

        while (!source.isVisible()) {
          source = _this.findById(sourceModel.comboId || sourceModel.parentId);

          if (!source || !sourceModel.parentId && !sourceModel.comboId) {
            return; // if all the ancestors of the oppsite are all hidden, ignore the edge
          }

          sourceModel = source.getModel();
        }

        sourceId = sourceModel.id;
        var targetModel = target.getModel(); // find the nearest visible ancestor

        while (!target.isVisible()) {
          target = _this.findById(targetModel.comboId || targetModel.parentId);

          if (!target || !targetModel.parentId && !targetModel.comboId) {
            return; // if all the ancestors of the oppsite are all hidden, ignore the edge
          }

          if (targetModel.comboId === comboModel.id || targetModel.parentId === comboModel.id) {
            break; // if the next ancestor is the combo, break the while
          }

          targetModel = target.getModel();
        }

        targetId = targetModel.id;

        if (sourceId) {
          var vedgeId = sourceId + "-" + targetId; // update the width of the virtual edges, which is the sum of merged actual edges
          // be attention that the actual edges with same endpoints but different directions will be represented by two different virtual edges

          if (edgeWeightMap[vedgeId]) {
            edgeWeightMap[vedgeId] += edge.getModel().size || 1;

            _this.updateItem(addedVEdges[vedgeId], {
              size: edgeWeightMap[vedgeId]
            }, false);

            return;
          }

          var vedge = _this.addItem('vedge', {
            target: targetId,
            source: sourceId,
            isVEdge: true
          }, false);

          edgeWeightMap[vedgeId] = edge.getModel().size || 1;
          addedVEdges[vedgeId] = vedge;
        }
      } else if ((cnodes.includes(source) || ccombos.includes(source)) && (cnodes.includes(target) || ccombos.includes(target))) {
        // both source and target are in the combo, if the target and source are both visible, show the edge
        if (source.isVisible() && target.isVisible()) {
          edge.show();
        }
      }
    }catch (e) {

    }
  })
}

function collapseCombo(graph, combo) {
  var _this = graph;

  if (isString(combo)) {
    combo = graph.findById(combo);
  }

  if (!combo) {
    console.warn('The combo to be collapsed does not exist!');
    return;
  }

  var comboModel = combo.getModel();
  var itemController = graph.get('itemController');
  itemController.collapseCombo(combo);
  comboModel.collapsed = true; // add virtual edges

  var edges = graph.getEdges().concat(graph.get('vedges')); // find all the descendant nodes and combos

  var cnodes = [];
  var ccombos = [];
  var comboTrees = graph.get('comboTrees');
  var found = false;
  var brothers = {};
  comboTrees && comboTrees.forEach(function (ctree) {
    brothers[ctree.id] = ctree;
  });
  comboTrees && comboTrees.forEach(function (ctree) {
    if (found) return; // if the combo is found, terminate the forEach

    traverseTree(ctree, function (subTree) {
      // if the combo is found and the it is traversing the other brothers, terminate
      if (found && brothers[subTree.id]) return false;

      if (comboModel.parentId === subTree.id) {
        // if the parent is found, store the brothers
        brothers = {};
        subTree.children.forEach(function (child) {
          brothers[child.id] = child;
        });
      } else if (comboModel.id === subTree.id) {
        // if the combo is found
        found = true;
      }

      if (found) {
        // if the combo is found, concat the descendant nodes and combos
        var item = _this.findById(subTree.id);

        if (item && item.getType && item.getType() === 'combo') {
          cnodes = cnodes.concat(item.getNodes());
          ccombos = ccombos.concat(item.getCombos());
        }
      }

      return true;
    });
  });
  var edgeWeightMap = {};
  var addedVEdges = [];
  edges.forEach(function (edge) {
    if (edge.isVisible() && !edge.getModel().isVEdge) return;
    try {
      var source = edge.getSource();
      var target = edge.getTarget();

      if ((cnodes.includes(source) || ccombos.includes(source)) && !cnodes.includes(target) && !ccombos.includes(target) || source.getModel().id === comboModel.id) {
        var edgeModel = edge.getModel();

        if (edgeModel.isVEdge) {
          _this.removeItem(edge, false);

          return;
        }

        var targetModel = target.getModel();

        while (!target.isVisible()) {
          target = _this.findById(targetModel.parentId || targetModel.comboId);
          if (!target || !targetModel.parentId && !targetModel.comboId) return; // all the ancestors are hidden, then ignore the edge

          targetModel = target.getModel();
        }

        var targetId = targetModel.id;

        if (edgeWeightMap[comboModel.id + "-" + targetId]) {
          edgeWeightMap[comboModel.id + "-" + targetId] += edgeModel.size || 1;
          return;
        } // the source is in the combo, the target is not


        var vedge = _this.addItem('vedge', {
          source: comboModel.id,
          target: targetId,
          isVEdge: true
        }, false);

        edgeWeightMap[comboModel.id + "-" + targetId] = edgeModel.size || 1;
        addedVEdges.push(vedge);
      } else if (!cnodes.includes(source) && !ccombos.includes(source) && (cnodes.includes(target) || ccombos.includes(target)) || target.getModel().id === comboModel.id) {
        var edgeModel = edge.getModel();

        if (edgeModel.isVEdge) {
          _this.removeItem(edge, false);

          return;
        }

        var sourceModel = source.getModel();

        while (!source.isVisible()) {
          source = _this.findById(sourceModel.parentId || sourceModel.comboId);
          if (!source || !sourceModel.parentId && !sourceModel.comboId) return; // all the ancestors are hidden, then ignore the edge

          sourceModel = source.getModel();
        }

        var sourceId = sourceModel.id;

        if (edgeWeightMap[sourceId + "-" + comboModel.id]) {
          edgeWeightMap[sourceId + "-" + comboModel.id] += edgeModel.size || 1;
          return;
        } // the target is in the combo, the source is not


        var vedge = _this.addItem('vedge', {
          target: comboModel.id,
          source: sourceId,
          isVEdge: true
        }, false);

        edgeWeightMap[sourceId + "-" + comboModel.id] = edgeModel.size || 1;
        addedVEdges.push(vedge);
      }
    }catch (e) {

    }
  }); // update the width of the virtual edges, which is the sum of merged actual edges
  // be attention that the actual edges with same endpoints but different directions will be represented by two different virtual edges

  addedVEdges.forEach(function (vedge) {
    var vedgeModel = vedge.getModel();

    _this.updateItem(vedge, {
      size: edgeWeightMap[vedgeModel.source + "-" + vedgeModel.target]
    }, false);
  });
};
export default {
  getDefaultCfg: function getDefaultCfg() {
    return {
      trigger: DEFAULT_TRIGGER,
      relayout: true
    };
  },
  getEvents: function getEvents() {
    var _a;

    var trigger; // 检测输入是否合法

    if (ALLOW_EVENTS.includes(this.trigger)) {
      trigger = this.trigger;
    } else {
      trigger = DEFAULT_TRIGGER; // eslint-disable-next-line no-console

      console.warn("Behavior collapse-expand-group 的 trigger 参数不合法，请输入 'click' 或 'dblclick'");
    }

    return _a = {}, _a["combo:" + trigger] = 'onComboClick', _a;
  },
  onComboClick: function onComboClick(evt) {
    var item = evt.item;

    var _a = this,
        graph = _a.graph,
        relayout = _a.relayout;

    if (!item || item.getType() !== 'combo') return;
    var model = item.getModel();
    var comboId = model.id;

    if (!comboId) {
      return;
    }
debugger
    collapseExpandCombo(graph,comboId);
    if (relayout && graph.get('layout'))
      graph.layout();
    else
      refreshPositions(graph);
  }
};
function refreshPositions (graph) {
  var self = graph;
  self.emit('beforegraphrefreshposition');
  var nodes = self.get('nodes');
  var edges = self.get('edges');
  var vedges = self.get('vedges');
  var combos = self.get('combos');
  var model;
  var updatedNodes = {};
  each(nodes, function (node) {
    model = node.getModel();
    var originAttrs = node.get('originAttrs');

    if (originAttrs && model.x === originAttrs.x && model.y === originAttrs.y) {
      return;
    }

    node.updatePosition({
      x: model.x,
      y: model.y
    });
    updatedNodes[model.id] = true;
    if (model.comboId) updatedNodes[model.comboId] = true;
  });

  if (combos && combos.length !== 0) {
    self.updateCombos();
  }

  each(edges, function (edge) {
    var sourceModel = edge.getSource().getModel();
    var targetModel = edge.getTarget().getModel();

    if (updatedNodes[sourceModel.id] || updatedNodes[targetModel.id] || edge.getModel().isComboEdge) {
      edge.refresh();
    }
  });
  each(vedges, function (vedge) {
    refresh(vedge);
  });
  self.emit('aftergraphrefreshposition');
  self.autoPaint();
}


function refresh (item) {
  var model = item.get('model'); // 更新元素位置
  item.updatePosition(model); // 更新元素内容，样式
  updateShape(item); // 做一些更新之后的操作
  item.afterUpdate(); // 清除缓存
  item.clearCache();
};
function updateShape(item) {
  var shapeFactory = item.get('shapeFactory');
  var model = item.get('model');
  var shape = model.shape || model.type; // 判定是否允许更新
  // 1. 注册的节点允许更新
  // 2. 更新后的 shape 等于原先的 shape

  if (shapeFactory.shouldUpdate(shape) && shape === item.get('currentShape')) {
    var updateCfg = getShapeCfg(item,model);
    shapeFactory.baseUpdate(shape, updateCfg, item);
  } else {
    // 如果不满足上面两种状态，重新绘制
    item.draw();
  } // 更新完以后重新设置原始样式


  item.setOriginStyle(model); // 更新后重置节点状态

  item.restoreStates(shapeFactory, shape);
};

function getShapeCfg (item, model) {
  var styles = item.get('styles');

  if (styles) {
    // merge graph的item样式与数据模型中的样式
    var newModel = model;
    newModel.style = Object.assign({}, styles, model.style);
    return newModel;
  }

  return model;
};
