import VectorLayer from "@planet/maps/layer/Vector";
import VectorSource from "@planet/maps/source/Vector";

import { useQueryStore } from "./stores/query";

export const SelectionLayer = () => {
  const [selectionFeatures] = useQueryStore((state) => [
    state.selectionFeatures,
  ]);

  return (
    <VectorLayer>
      <VectorSource features={selectionFeatures} />
    </VectorLayer>
  );
};
