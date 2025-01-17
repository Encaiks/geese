import * as React from 'react';
import useSWRImmutable from 'swr/immutable';

import { fetcher } from '@/services/base';
import { makeUrl } from '@/utils/api';
import { numFormat } from '@/utils/util';

import Loading from '../loading/Loading';

import { Stats } from '@/types/home';

export default function Status() {
  const { data: stats } = useSWRImmutable<Stats>(makeUrl('/stats/'), fetcher, {
    revalidateIfStale: false,
  });

  return (
    <div className='space-y-1.5 rounded-lg bg-white px-3 py-2.5 dark:bg-gray-800'>
      {stats ? (
        <div className='flex flex-wrap border-b border-b-slate-300 pb-3 dark:border-b-slate-700'>
          <div className='flex-1 pr-4'>
            <div className='whitespace-nowrap text-base text-slate-400'>
              用户总数
            </div>
            <div className='text-3xl dark:text-slate-300'>
              {numFormat(stats?.user_total, 1, 10000)}
            </div>
          </div>
          <div className='flex-1'>
            <div className='whitespace-nowrap text-base text-slate-400'>
              开源项目
            </div>
            <div className='text-3xl dark:text-slate-300'>
              {numFormat(stats?.repo_total, 1)}
            </div>
          </div>
        </div>
      ) : (
        <Loading></Loading>
      )}

      <div className='text-base text-slate-400'>关于本站</div>
      <div className='text-sm leading-7 dark:text-slate-300'>
        HelloGitHub 是一个分享有趣、 入门级开源项目的平台。
        希望大家能够在这里找到编程的快乐、 轻松搞定问题的技术方案、
        大呼过瘾的开源神器， 顺其自然地开启开源之旅。
      </div>
    </div>
  );
}
