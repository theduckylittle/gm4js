import { gmMapPanel, gmSearchPanelLogoFragment } from "./common.module.css";
import { Search as SearchBox } from "./Search";

const logoFragment = `
  <div style="text-align: center">
    <a target="_blank" href="https://www.geomoose.org">
      <img src="/public/logo_2011.png"/>
    </a>
  </div>
`;

export const SearchPanel = () => {
  return (
    <div
      className={gmMapPanel}
      style={{
        top: "var(--gm-search-panel-top)",
        left: "var(--gm-search-panel-left)",
        width: "var(--gm-search-panel-width)",
      }}
    >
      {!!logoFragment && (
        <div
          className={gmSearchPanelLogoFragment}
          dangerouslySetInnerHTML={{ __html: logoFragment }}
        ></div>
      )}

      <SearchBox />
    </div>
  );
};
