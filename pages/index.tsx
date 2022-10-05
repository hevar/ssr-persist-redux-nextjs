import Head from "next/head";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux"
import Layout, { siteTitle } from "../components/layout";
import { decrement, increment } from "../lib/counter_slice"
import { RootState } from "../lib/store"
import utilStyles from "../styles/utils.module.css";

export default function Home({}) {

  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2>take a look at some pokemon</h2>
        <ul>
          <li>
            Bulbasaur <Link href="/pokemon/bulbasaur">dynamic</Link>{" "}
            <Link href="/pokemon/ssr/bulbasaur">SSR</Link>{" "}
            <Link href="/pokemon/ssg/bulbasaur">SSG</Link>
          </li>
          <li>
            Beedrill <Link href="/pokemon/beedrill">dynamic</Link>{" "}
            <Link href="/pokemon/ssr/beedrill">SSR</Link>{" "}
            <Link href="/pokemon/ssg/beedrill"> fallback SSG</Link>
          </li>
        </ul>
      </section>

      <section>
        <div>
          <div>
            <button
                aria-label="Increment value"
                onClick={() => dispatch(increment())}
            >
              Increment
            </button>
            <span>{count}</span>
            <button
                aria-label="Decrement value"
                onClick={() => dispatch(decrement())}
            >
              Decrement
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  return {
    props: {},
  };
}
