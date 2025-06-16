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
            <SideBarItemSubMenu title={t("sidebar.menu-auth-user")} path="/user" />
          </SideBarItemMenu>
        </SideBarItem>

        <SideBarItem title={t("sidebar.menu-budget")} hasSubItem href="ui-presupuesto" IconComponent={HouseMenuIcon}>
          <SideBarItemMenu id="ui-presupuesto">
            <SideBarItemSubMenu title={t("sidebar.menu-budget-duplex")} path="/duplex" />
            <SideBarItemSubMenu title={t("sidebar.menu-budget-tracking")} path="/duplex-tracking" />
          </SideBarItemMenu>
        </SideBarItem>

        <SideBarItem title={t("sidebar.menu-land")} hasSubItem href="ui-terrenos" IconComponent={MapMenuIcon}>
          <SideBarItemMenu id="ui-terrenos">
            <SideBarItemSubMenu title={t("sidebar.menu-land-supplier")} path="/supplier" />
            <SideBarItemSubMenu title={t("sidebar.menu-land-land")} path="/land" />
          </SideBarItemMenu>
        </SideBarItem>

        <SideBarItem title={t("sidebar.menu-expense")} hasSubItem href="ui-egresos" IconComponent={MoneyMenuIcon}>
          <SideBarItemMenu id="ui-egresos">
            <SideBarItemSubMenu title={t("sidebar.menu-expense-type")} path="/expense-type" />
            <SideBarItemSubMenu title={t("sidebar.menu-expense-register")} path="/expense" />
          </SideBarItemMenu>
        </SideBarItem>
      </ul>
    </nav>
  );
};
