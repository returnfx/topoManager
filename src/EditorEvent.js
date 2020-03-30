var EditorEvent=function (_target,_data){
    var self = this;
    self.data = _data;
    self.target = _target;
}

EditorEvent.CHANGE_NODE_DATA="change_node_data";//节点数据
EditorEvent.CHANGE_OPTION_TOOL="change_option_tool";//操作工具改变
EditorEvent.DRAG_DRAW_STOP="drag_draw_stop";//拖拽停止
EditorEvent.DRAG_STOP="drag_stop";//拖拽停止
EditorEvent.CHANGE_EDIT_STATE_TOOL="change_edit_state_tool";//切换编辑状态
EditorEvent.CHANGE_EDIT_STATE="change_edit_state";//切换编辑状态
EditorEvent.CHANGE_EDIT_SCALE="change_edit_scale";//切换编辑状态
EditorEvent.CHANGE_ZOOM="change_zoom";
EditorEvent.RESET_OPTION_TOOL="reset_option_tool";

//通信相关事件
EditorEvent.NET_ADD_NODE="net_add_node";//添加节点
EditorEvent.NET_ADD_LINK="net_add_link";//添加连线
EditorEvent.NET_ADD_GROUP="net_add_group";//添加添加组
EditorEvent.NET_DEL_NODE="net_del_node";//删除节点
EditorEvent.NET_SAVE_DATA="net_save_data";//保存数据
EditorEvent.NET_RIGHT_MENU="net_right_menu";//右键菜单
EditorEvent.NET_MERAGE_LINK="net_merage_link";//合并连线
EditorEvent.NET_EXPORT_IDC="net_export_idc";//导出数据
EditorEvent.NET_PORTGROUP_FLUX="net_portgroup_flux";//端口分组流量

EditorEvent.CLICK_TIME_LINE="click_time_line";//点击时间轴
EditorEvent.STOP_FIND="stop_find";//停止发现
EditorEvent.SAVE_FIND="save_find";//停止发现

module.exports=EditorEvent;