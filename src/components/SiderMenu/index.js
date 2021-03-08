import 'rc-drawer/assets/index.css';
import React from 'react';
import Drawer from 'rc-drawer';
import SiderMenu from './SiderMenu';

export default props =>
  props.isMobile ? (
    <Drawer
      parent={null}
      level={null}
      iconChild={null}
      open={!props.collapsed}
      onMaskClick={() => {
        props.onCollapse(true);
      }}
      width="256px"
    >
      <SiderMenu {...props} collapsed={props.isMobile ? false : props.collapsed} />
    </Drawer>
  ) : (
    <SiderMenu {...props} />
  );
