import { GithubOutlined } from '@ant-design/icons';
import { Button, Dropdown, Space } from 'antd';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { shallow } from 'zustand/shallow';

import PackageJson from '@/../package.json';
import { useAppStore } from '@/store';

import Logo from './Logo';
import { themeIcon, ThemeList } from './style';

/******************************************************
 *********************** Style *************************
 ******************************************************/
const View = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  height: 46px;
  padding: 16px 24px;

  background: ${({ theme }) => theme.colorBgContainer};
  border-bottom: 1px solid ${({ theme }) => theme.colorBorderSecondary};
`;

/******************************************************
 ************************* Dom *************************
 ******************************************************/

interface HeaderProps {
  children?: ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  const [themeMode, onSetThemeMode] = useAppStore(
    (st) => [st.themeMode, st.onSetThemeMode],
    shallow,
  );

  return (
    <View>
      <Logo />
      <Space>
        {children}
        <a href={PackageJson.repository.url} rel="noreferrer" target="_blank">
          <Button icon={<GithubOutlined />} />
        </a>
        <Dropdown
          menu={{
            items: ThemeList({ onSetThemeMode }),
          }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Button icon={themeIcon[themeMode]} />
        </Dropdown>
      </Space>
    </View>
  );
};

export default React.memo(Header);
