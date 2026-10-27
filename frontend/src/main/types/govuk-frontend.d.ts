declare module 'govuk-frontend' {
  export function initAll(): void;
}

declare module '@ministryofjustice/frontend' {
  const MOJFrontend: {
    initAll(): void;
  };

  export default MOJFrontend;
}
