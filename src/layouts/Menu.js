import Link from "next/link";
import React, { Fragment } from "react";
import { useLocale } from 'next-intl';

const withLocale = (Component) => {
  return function WrappedComponent(props) {
    const locale = useLocale();
    return <Component locale={locale} {...props} />;
  };
};

export const Home = withLocale(({ locale }) => (
  <Fragment>
    <li className="menu-item">
      <Link href={`/${locale}`}>Home One</Link>
    </li>
    <li className="menu-item">
      <Link href={`/${locale}/index-2`}>Home Two</Link>
    </li>
    <li className="menu-item">
      <Link href={`/${locale}/index-3`}>Home Three</Link>
    </li>
  </Fragment>
));

export const About = withLocale(({ locale }) => (
  <Fragment>
    <li className="menu-item">
      <Link href={`/${locale}/about`}>About us</Link>
    </li>
  </Fragment>
));

export const Listing = withLocale(({ locale }) => (
  <Fragment>
    <li className="menu-item hidden">
      <Link href={`/${locale}/listing-list`}>Listing List</Link>
    </li>
    <li className="menu-item">
      <Link href={`/${locale}/listing-grid`}>Listing Grid</Link>
    </li>
    <li className="menu-item hidden">
      <Link href={`/${locale}/listing-map`}>Listing Map Grid</Link>
    </li>
    <li className="menu-item">
      <Link href={`/${locale}/listing-details-1`}>Listing Details One</Link>
    </li>
    <li className="menu-item hidden">
      <Link href={`/${locale}/listing-details-2`}>Listing Details Two</Link>
    </li>
  </Fragment>
));

export const Pages = withLocale(({ locale }) => (
  <Fragment>
    <li className="menu-item">
      <Link href={`/${locale}/add-listing`}>Add Listing</Link>
    </li>
    <li className="hidden">
      <Link href={`/${locale}/products`}>Our Products</Link>
    </li>
    <li className="hidden">
      <Link href={`/${locale}/product-details`}>Products Details</Link>
    </li>
    <li className="menu-item">
      <Link href={`/${locale}/how-work`}>How Work</Link>
    </li>
    <li className="menu-item">
      <Link href={`/${locale}/pricing`}>Pricing</Link>
    </li>
  </Fragment>
));

export const Blog = withLocale(({ locale }) => (
  <Fragment>
    <li className="menu-item">
      <Link href={`/${locale}/blog`}>Our Blog</Link>
    </li>
    <li className="menu-item">
      <Link href={`/${locale}/blog-details`}>Blog details</Link>
    </li>
  </Fragment>
));

export const Contact = withLocale(({ locale }) => (
  <Fragment>
    <li className="menu-item">
      <Link href={`/${locale}/contact`}>Contact</Link>
    </li>
  </Fragment>
));
