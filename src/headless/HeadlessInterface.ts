export interface HeadlessServiceInterface {
  /**
   * This function is called when native service onStart is called.
   */
  onStart(): Promise<void>;
  /**
   * This function is called when native service onStop is called.
   */
  onStop(): Promise<void>;
}
