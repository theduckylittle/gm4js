import { Accordion, AccordionTab } from "primereact/accordion";

import { gmMapPanel, gmSearchPanelLogoFragment } from "./common.module.css";
import { Search as SearchBox } from "./Search";
import { SelectBox } from "./SelectBox";
import { useSiteSettingsStore } from "./stores/site-settings";

export const SearchPanel = () => {
  const [logoHtml] = useSiteSettingsStore((state) => [state.logoHtml]);

  return (
    <div
      className={gmMapPanel}
      style={{
        top: "var(--gm-search-panel-top)",
        left: "var(--gm-search-panel-left)",
        width: "var(--gm-search-panel-width)",
      }}
    >
      {!!logoHtml && (
        <div
          className={gmSearchPanelLogoFragment}
          dangerouslySetInnerHTML={{ __html: logoHtml }}
        ></div>
      )}
      <Accordion activeIndex={0}>
        <AccordionTab header="Search">
          <SearchBox />
        </AccordionTab>
        <AccordionTab header="Select features">
          <SelectBox />
        </AccordionTab>
      </Accordion>
    </div>
  );
};
