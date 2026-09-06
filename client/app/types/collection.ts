// -Path: 'client/app/types/collection.ts'
/** Origin tab for a collection (exam sets, decks, etc.). Cloud and community
 *  have no backend yet; they render a "coming soon" state only. */
export type CollectionTab = 'local' | 'cloud' | 'community';
