import { h } from 'preact';
import { Container } from './Container';
import { Heading, Subheading } from './Typography';
import styled from 'styled-components';
import { useEffect, useRef, useState } from 'preact/hooks';

interface TabNavProps {
  tabs: { id: string; heading?: string | JSX.Element }[];
}

export const TabNav: React.FC<TabNavProps> = ({ tabs, children }) => {
  const [activeTab, setActiveTab] = useState<string | undefined>(tabs[0]?.id);

  const containerRef = useRef<HTMLDivElement>(null);

  const childArray = Array.isArray(children) ? children : [children];

  const [activeTabElement, setActiveTabElement] = useState<
    React.ReactNode | undefined
  >(childArray[0]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const tabElement = childArray.find((child) => {
      // this must be the dumbest thing ever
      if (
        child instanceof Object &&
        'type' in child &&
        child.type === Tab &&
        child.props.tabId === activeTab
      ) {
        return child;
      }
    });

    setActiveTabElement(tabElement);
  }, [activeTab, containerRef]);

  return (
    <Container
      ref={containerRef}
      flexDirection="column"
      height="100%"
      width="100%"
    >
      <Container>
        {tabs.map((tab) => (
          <TabLink
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            <Subheading>{tab.heading ?? tab.id}</Subheading>
          </TabLink>
        ))}
      </Container>

      <Container width="100%" height="100%">
        {childArray.find((child) => child === activeTabElement) ??
          childArray[0]}
      </Container>
    </Container>
  );
};

const TabLink = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 32px;

  :hover,
  :focus {
    text-decoration: underline;
    outline: none;
  }

  ${(props) =>
    props.active
      ? `
    text-decoration: underline;
  `
      : ``}
`;

export const Tab: React.FC<{ tabId: string }> = ({ children, tabId }) => {
  return <>{children}</>;
};
