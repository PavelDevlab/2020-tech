declare module "isomorphic-style-loader"
declare module "isomorphic-style-loader/StyleContext"
declare module "isomorphic-style-loader/withStyles" {
  export default function withStyles<A>(...args:any[]):(arg0:A) => A;
}
