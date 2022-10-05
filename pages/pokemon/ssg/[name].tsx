import Pokemon from "../[name]";
import {
  getPokemonByName,
  getPokemonList,
  getRunningOperationPromises,
} from "../../../lib/pokemonApi";
import { makeStore } from "../../../lib/store";

export async function getStaticPaths() {
  const store = makeStore();

  // @ts-ignore - Throws error due to adding __persistor to store in makeStore()
  const result = await store.dispatch(getPokemonList.initiate());

  return {
    paths: result.data?.results
      .map((p) => `/pokemon/ssg/${p.name}`)
      .slice(0, 10),
    fallback: true,
  };
}

import { wrapper } from "../../../lib/store";

export default Pokemon;

export const getStaticProps = wrapper.getStaticProps(
  (store) => async (context) => {
    const name = context.params?.name;
    if (typeof name === "string") {
      // @ts-ignore - Throws error due to adding __persistor to store in makeStore()
      store.dispatch(getPokemonByName.initiate(name));
    }

    await Promise.all(getRunningOperationPromises());

    return {
      props: {},
    };
  }
);
