import { SideBarItem } from "@layouts/SideBarItem";
import { SideBarItemMenu } from "@layouts/SideBarItemMenu";
import { SideBarItemSubMenu } from "@layouts/SideBarItemSubMenu";
import { useI18n } from "@store/I18nContext";
import { UserMenuIcon } from "@assets/icons/UserMenuIcon";
import { HouseMenuIcon } from "@assets/icons/HouseMenuIcon";
import { MapMenuIcon } from "@assets/icons/MapMenuIcon";
import { MoneyMenuIcon } from "@assets/icons/MoneyMenuIcon";

export const SideBar = () => {
  const { t } = useI18n();

  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav">
        <li className="nav-item nav-category">{t("sidebar.title")}</li>
        <SideBarItem title={t("sidebar.menu-auth")} hasSubItem href="ui-autenticacion" IconComponent={UserMenuIcon}>
          <SideBarItemMenu id="ui-autenticacion">
            <SideBarItemSubMenu title={t("sidebar.menu-auth-user")} path="/users" />
          </SideBarItemMenu>
        </SideBarItem>

        <SideBarItem title={t("sidebar.menu-budget")} hasSubItem href="ui-presupuesto" IconComponent={HouseMenuIcon}>
          <SideBarItemMenu id="ui-presupuesto">
            <SideBarItemSubMenu title={t("sidebar.menu-budget-duplex")} path="/duplex" />
            <SideBarItemSubMenu title={t("sidebar.menu-budget-tracking")} path="/tracking-budget" />
            <SideBarItemSubMenu title={t("sidebar.menu-budget-report")} path="/report-budget" />
          </SideBarItemMenu>
        </SideBarItem>

        <SideBarItem title={t("sidebar.menu-land")} hasSubItem href="ui-terrenos" IconComponent={MapMenuIcon}>
          <SideBarItemMenu id="ui-terrenos">
            <SideBarItemSubMenu title={t("sidebar.menu-land-supplier")} path="/user" />
            <SideBarItemSubMenu title={t("sidebar.menu-land-land")} path="/user" />
            <SideBarItemSubMenu title={t("sidebar.menu-land-report")} path="/user" />
          </SideBarItemMenu>
        </SideBarItem>

        <SideBarItem title={t("sidebar.menu-bill")} hasSubItem href="ui-egresos" IconComponent={MoneyMenuIcon}>
          <SideBarItemMenu id="ui-egresos">
            <SideBarItemSubMenu title={t("sidebar.menu-bill-type")} path="/user" />
            <SideBarItemSubMenu title={t("sidebar.menu-bill-register")} path="/user" />
            <SideBarItemSubMenu title={t("sidebar.menu-bill-report")} path="/user" />
          </SideBarItemMenu>
        </SideBarItem>
      </ul>
    </nav>
  );
};
