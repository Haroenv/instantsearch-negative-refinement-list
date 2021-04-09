
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

// Expanding the type to give nicer information
export type RequiredKeys<TObject, TKeys extends keyof TObject> = Expand<
  Required<Pick<TObject, TKeys>> & Omit<TObject, TKeys>
>;
