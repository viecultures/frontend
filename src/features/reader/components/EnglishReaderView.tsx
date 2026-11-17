import { BilingualReaderView, type BilingualReaderViewProps } from './bilingual-reader-view';

/** The default Reader surface; the shared reading interactions remain in one place. */
export function EnglishReaderView(props: Omit<BilingualReaderViewProps, 'layout'>) {
  return <BilingualReaderView {...props} layout="english" />;
}
