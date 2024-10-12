import axios from "axios";
import PropTypes from "prop-types";
import { SortAscending, CaretCircleLeft, CaretCircleRight, Eye, FileText } from "@phosphor-icons/react";
import { useEffect, useMemo, useState, useRef } from "react";
import { Tabs, Container, Loader, Badge, Button, Divider, Flex, Grid, Paper, Select, Text, CloseButton } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import classes from '../RSPC/styles/researchProjectsStyle.module.css';
import CustomBreadcrumbs from "../../components/Breadcrumbs.jsx";
import ProjectTable from "./components/projectTable.jsx";
import RequestTable from "./components/requestTable.jsx";
import InboxTable from "./components/inboxTable.jsx";
import ProjectForm from "./components/projectForm.jsx";

const categories = ["Most Recent", "Ongoing", "Completed", "Terminated"];

function ResearchProjects() {
  const role = useSelector(state => state.user.role);
  const username = useSelector(state => state.user.username);

  const [activeTab, setActiveTab] = useState("0");
  const [sortedBy, setSortedBy] = useState("Most Recent");
  const [loading, setLoading] = useState(false);
  const [read_Loading, setRead_Loading] = useState(-1);
  const dispatch = useDispatch();
  const tabsListRef = useRef(null);

  const tabItems = [{ title: "Projects" }];
  if (role === 'Professor') tabItems.push({ title: 'Requests' });
  else tabItems.push({ title: 'Inbox' });
  if (role === 'rspc_admin') tabItems.push({ title: 'Add Project' });

  const handleTabChange = (direction) => {
    const newIndex =
      direction === "next"
        ? Math.min(+activeTab + 1, tabItems.length - 1)
        : Math.max(+activeTab - 1, 0);
    setActiveTab(String(newIndex));
    tabsListRef.current.scrollBy({
      left: direction === "next" ? 50 : -50,
      behavior: "smooth",
    });
  };

  // const notificationsToDisplay =
  //   activeTab === "1" ? announcementsList : notificationsList;

  return (
    <>
      <CustomBreadcrumbs />
      <Flex justify="space-between" align="center" mt="lg">
        <Flex
          justify="flex-start"
          align="center"
          gap={{ base: "0.5rem", md: "1rem" }}
          mt={{ base: "1rem", md: "1.5rem" }}
          ml={{ md: "lg" }}
        >
          <Button
            onClick={() => handleTabChange("prev")}
            variant="default"
            p={0}
            style={{ border: "none" }}
          >
            <CaretCircleLeft
              className={classes.fusionCaretCircleIcon}
              weight="light"
            />
          </Button>

          <div className={classes.fusionTabsContainer} ref={tabsListRef}>
            <Tabs value={activeTab} onChange={setActiveTab}>
              <Tabs.List style={{ display: "flex", flexWrap: "nowrap" }}>
                {tabItems.map((item, index) => (
                  <Tabs.Tab
                    value={`${index}`}
                    key={index}
                    className={
                      activeTab === `${index}`
                        ? classes.fusionActiveRecentTab
                        : ""
                    }
                  >
                    <Flex gap="4px">
                      <Text>{item.title}</Text>
                    </Flex>
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            </Tabs>
          </div>

          <Button
            onClick={() => handleTabChange("next")}
            variant="default"
            p={0}
            style={{ border: "none" }}
          >
            <CaretCircleRight
              className={classes.fusionCaretCircleIcon}
              weight="light"
            />
          </Button>
        </Flex>
        <Flex align="center" mt="md" rowGap="1rem" columnGap="4rem" wrap="wrap">
          <Select
            classNames={{
              option: classes.selectoptions,
              input: classes.selectinputs,
            }}
            variant="filled"
            leftSection={<SortAscending />}
            data={categories}
            value={sortedBy}
            onChange={setSortedBy}
            placeholder="Sort By"
          />
        </Flex>
      </Flex>

      {activeTab === "0" ? (
        <ProjectTable setActiveTab={setActiveTab}/>
      ) : activeTab === "1" ? (
        role === "Professor" ? <RequestTable /> : <InboxTable />
      ) : activeTab === "2" ? (
        <ProjectForm setActiveTab={setActiveTab} />
      ) : null}

    </>
  );
}

export default ResearchProjects;