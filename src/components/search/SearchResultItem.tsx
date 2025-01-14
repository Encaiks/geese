import Link from 'next/link';
import { NextPage } from 'next/types';

import { SearchResultItemProps } from '@/types/search';

/**
 * 单个搜索结果展示组件
 * @param repo
 * @returns
 */
const SearchResultItem: NextPage<SearchResultItemProps> = ({ repo }) => {
  return (
    <article>
      <Link href={`/repository/${repo.rid}`}>
        <div className='hover-gray relative cursor-pointer bg-white py-3 pl-4 pr-3 hover:bg-slate-50 dark:bg-gray-800'>
          <div className='pb-0.5'>
            <div className='text-color-primary flex justify-between visited:text-slate-500 dark:text-slate-300 '>
              <span className='truncate pt-1 text-base leading-snug'>
                {repo.name}
              </span>
              <span className='mt-1 ml-1 h-4 whitespace-nowrap rounded-md bg-blue-400 py-0.5 px-2 text-xs font-semibold leading-none text-white dark:text-slate-100'>
                Star {repo.stars_str}
              </span>
            </div>
          </div>
          <div className='truncate pt-1 text-sm text-slate-400 '>
            {repo.description}
          </div>
        </div>
      </Link>
    </article>
  );
};

export default SearchResultItem;
