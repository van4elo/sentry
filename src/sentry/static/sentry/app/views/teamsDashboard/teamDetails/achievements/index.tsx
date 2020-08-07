import React from 'react';
import styled from '@emotion/styled';
import {RouteComponentProps} from 'react-router/lib/Router';

import {t} from 'app/locale';
import space from 'app/styles/space';
import {PanelHeader, Panel, PanelBody} from 'app/components/panels';
import Badge from 'app/components/badge';
import recreateRoute from 'app/utils/recreateRoute';

import Card from './card';
import {all, earned, locked} from './mocks';

enum TAB {
  ALL = 'all',
  EARNED = 'earned',
  LOCKED = 'locked',
}

type Props = Pick<
  RouteComponentProps<{orgSlug: string; teamSlug: string}, {}>,
  'location' | 'routes' | 'params'
>;

type State = {
  currentTab: TAB;
};

class Achievements extends React.Component<Props, State> {
  state: State = {
    currentTab: TAB.EARNED,
  };

  renderSidebarContent = () => {
    const {currentTab} = this.state;

    let content = all;

    switch (currentTab) {
      case TAB.EARNED:
        content = earned;
        break;
      case TAB.LOCKED:
        content = locked;
        break;
      default:
        content = all;
        break;
    }

    return content.map(c => <Card key={c.id} achievement={c} />);
  };

  renderContent() {
    const {currentTab} = this.state;
    const {location, routes, params} = this.props;
    const baseUrl = recreateRoute('', {location, routes, params, stepBack: -1});

    return (
      <Wrapper>
        <Sidebar>
          <SidebarItem
            isActive={currentTab === TAB.ALL}
            onClick={() => this.setState({currentTab: TAB.ALL})}
          >
            {t('All')}
            <Badge
              text={all.length}
              priority={currentTab === TAB.ALL ? 'active' : undefined}
            />
          </SidebarItem>
          <SidebarItem
            isActive={currentTab === TAB.EARNED}
            onClick={() => this.setState({currentTab: TAB.EARNED})}
          >
            {t('Earned')}
            <Badge
              text={earned.length}
              priority={currentTab === TAB.EARNED ? 'active' : undefined}
            />
          </SidebarItem>
          <SidebarItem
            isActive={currentTab === TAB.LOCKED}
            onClick={() => this.setState({currentTab: TAB.LOCKED})}
          >
            {t('Locked')}
            <Badge
              text={locked.length}
              priority={currentTab === TAB.LOCKED ? 'active' : undefined}
            />
          </SidebarItem>
        </Sidebar>
        <Content>{this.renderSidebarContent()}</Content>
      </Wrapper>
    );
  }

  render() {
    return (
      <Panel>
        <PanelHeader>{t('Achievements')}</PanelHeader>
        <PanelBody>{this.renderContent()}</PanelBody>
      </Panel>
    );
  }
}

export default Achievements;

const Wrapper = styled('div')`
  display: grid;
  grid-template-columns: max-content 1fr;
`;

const Sidebar = styled('div')`
  border-right: 1px solid ${p => p.theme.gray300};
  padding: ${space(2)};
  padding-right: ${space(4)};
`;

const SidebarItem = styled('div')<{isActive: boolean}>`
  color: ${p => (p.isActive ? p.theme.gray800 : p.theme.gray500)};
  font-size: ${p => p.theme.fontSizeMedium};
  height: 40px;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const Content = styled('div')`
  padding: ${space(2)};
  display: grid;
  grid-template-columns: repeat(auto-fit, 271px);
  grid-gap: ${space(3)};
`;
