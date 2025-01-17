import classNames from 'classnames';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { GoRepoForked } from 'react-icons/go';
import { IoIosStarOutline } from 'react-icons/io';
import { MdOutlineRemoveRedEye } from 'react-icons/md';

import ImageWithPreview from '@/components/ImageWithPreview';
import MDRender from '@/components/mdRender/MDRender';
import Pagination from '@/components/pagination/Pagination';
import Seo from '@/components/Seo';
import ToTop from '@/components/toTop/ToTop';

import { recordGoGithub } from '@/services/repository';
import { getVolume, getVolumeNum } from '@/services/volume';
import { numFormat } from '@/utils/util';

import {
  PeriodicalPageProps,
  VolumeCategory,
  VolumeItem,
} from '@/types/volume';

type CategoryTopRange = {
  id: string;
  start: number;
  end: number;
};

const PeriodicalPage: NextPage<PeriodicalPageProps> = ({ volume }) => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>('');
  // 月刊列表
  const categoryList: VolumeCategory[] = useMemo(() => {
    return volume?.data || [];
  }, [volume]);

  const onPageChange = (page: number) => {
    router.push(`/periodical/volume/${page}`);
  };
  const onClickLink = (item: VolumeItem) => {
    // 调用接口记录链接点击信息
    recordGoGithub(item.rid);
  };

  const allItems: string[] = categoryList
    .reduce((acc: any, category: any) => {
      return acc.concat(category.items);
    }, [])
    .map((item: VolumeItem) => item.rid);

  const itemIndex = (item: VolumeItem) => {
    return allItems.indexOf(item.rid) + 1;
  };
  const linkClassName = (id: string) =>
    classNames(
      'cursor-pointer rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-700',
      {
        'text-blue-500': id === activeCategory,
        'text-gray-700 dark:text-gray-400': id !== activeCategory,
      }
    );

  const ticking = useRef(false);
  const categoryEles = useRef<CategoryTopRange[]>([]);

  // 设置每个段落的top值范围, 用于滚动时判断对应目录标题高亮
  useEffect(() => {
    categoryEles.current = [];
    categoryList?.forEach((category, index: number) => {
      const id = `#category-${category.category_id}`;
      const el: HTMLElement = document.querySelector(id) as HTMLElement;

      let categoryTopRange: CategoryTopRange = {
        id,
        start: 0,
        end: 0,
      };

      if (index === categoryList.length - 1) {
        categoryTopRange = {
          id,
          start: el.offsetTop,
          end: document.body.offsetHeight,
        };
      } else {
        const nextEl: HTMLElement = document.querySelector(
          `#category-${categoryList[index + 1].category_id}`
        ) as HTMLElement;

        categoryTopRange = {
          id,
          start: el.offsetTop,
          end: nextEl.offsetTop,
        };
      }
      categoryEles.current.push(categoryTopRange);
    });
  }, [categoryList]);

  // 监听 body 滚动事件, 设置对应当前内容的目录标题高亮
  useEffect(() => {
    const body: HTMLElement = document.getElementsByTagName(
      'body'
    )[0] as HTMLElement;

    body.onscroll = (e: Event) => {
      if (!ticking.current) {
        window.requestAnimationFrame(function () {
          const top = (e.target as any)?.documentElement.scrollTop || 0;
          const category: CategoryTopRange | undefined =
            categoryEles.current.find(
              (cate) => cate.start <= top && cate.end > top
            );
          if (category) {
            setActiveCategory((category as CategoryTopRange).id);
          }
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
  }, [categoryEles]);

  if (router.isFallback) {
    return (
      <div className='mt-20 flex animate-pulse'>
        <Seo title='月刊' />
        <div className='ml-4 mt-2 w-full'>
          <h3 className='h-4 rounded-md bg-gray-200'></h3>

          <ul className='mt-5 space-y-3'>
            <li className='h-4 w-full rounded-md bg-gray-200'></li>
            <li className='h-4 w-full rounded-md bg-gray-200'></li>
            <li className='h-4 w-full rounded-md bg-gray-200'></li>
            <li className='h-4 w-full rounded-md bg-gray-200'></li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className='flex shrink grow flex-row sm:border-l md:border-none'>
      <div className='relative w-0 shrink grow lg:w-9/12 lg:grow-0'>
        <div className='relative pb-6'>
          <Seo title={`HelloGitHub 第 ${volume?.current_num} 期`} />
          <div className='mt-2 mb-2 bg-white p-5 dark:bg-gray-800 md:rounded-lg'>
            <div className='my-4 flex flex-col items-center px-2'>
              <h1 className='mb-2 font-medium text-black dark:text-white'>
                《HelloGitHub》第 {volume?.current_num} 期
              </h1>
              <h2 className='text-center text-xl font-normal text-gray-400'>
                兴趣是最好的老师，HelloGitHub 让你对编程感兴趣！
              </h2>
            </div>
            {categoryList?.map((category: VolumeCategory, _cIndex: number) => {
              const id = `category-${category.category_id}`;
              return (
                <div id={id} key={category.category_id} className='pb-5'>
                  <h1 className='mt-4 text-xl text-black dark:text-white'>
                    {category.category_name}
                  </h1>
                  {category.items.map((item: VolumeItem) => {
                    return (
                      <div key={item.rid}>
                        <div className='mt-3 mb-2 inline-flex gap-1'>
                          <span>{itemIndex(item)}.</span>
                          <a
                            href={item.github_url}
                            target='_blank'
                            onClick={() => onClickLink(item)}
                            className=' text-blue-600'
                            rel='noreferrer'
                          >
                            <span>{item.name}</span>
                          </a>
                        </div>
                        {/* stars forks watch */}
                        <div className='mb-2 flex  text-sm text-gray-500 dark:text-gray-400'>
                          <span className='mr-2 flex '>
                            <IoIosStarOutline size={16} />
                            Star {numFormat(item.stars, 1)}
                          </span>
                          <span className='mr-2 flex'>
                            <GoRepoForked size={16} />
                            Fork {numFormat(item.forks, 1)}
                          </span>
                          <span className='flex'>
                            <MdOutlineRemoveRedEye size={16} />
                            Watch {numFormat(item.watch, 1)}
                          </span>
                        </div>
                        {/* markdown 内容渲染 */}
                        <MDRender>{item.description}</MDRender>

                        {/* 图片预览 */}
                        {item.image_url && (
                          <div className='my-2 flex justify-center'>
                            <ImageWithPreview
                              className='cursor-zoom-in rounded-lg'
                              src={item.image_url}
                              alt={item.name}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <Pagination
            total={volume?.total}
            current={volume?.current_num}
            onPageChange={onPageChange}
          />
        </div>
      </div>

      <div className='relative hidden w-3/12 shrink-0 md:block md:grow-0'>
        {/* 右侧目录 */}
        <div>
          <div className='top-15 fixed w-3/12 xl:w-2/12'>
            <div className='mt-2 ml-3 bg-white p-4 dark:bg-gray-800 md:rounded-lg'>
              <h4 className='mb-2 border-b border-gray-200 pb-2 dark:border-gray-700'>
                目录
              </h4>
              <ul
                className='custom-scrollbar overflow-scroll'
                style={{ maxHeight: 550 }}
              >
                {categoryList?.map((category, cIndex) => {
                  const id = `#category-${category.category_id}`;

                  return (
                    <li
                      key={cIndex}
                      className={linkClassName(id)}
                      onClick={() => {
                        setActiveCategory(id);
                        const { offsetTop } = document.querySelector(
                          id
                        ) as HTMLElement;
                        // 根据 offsetTop 滚动到指定位置
                        window.scrollTo({
                          top: offsetTop,
                        });
                      }}
                    >
                      {category.category_name}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <ToTop cb={() => setActiveCategory('')} />
        </div>
      </div>
    </div>
  );
};

export default PeriodicalPage;

// 此函数在构建时被调用
export async function getStaticPaths() {
  // 调用外部 API 获取月刊的总期数
  const { data } = await getVolumeNum();
  // const posts = data.map(({ num }) => ({ id: String(num) }));

  // 根据博文列表生成所有需要预渲染的路径
  const paths = data.map((item) => ({
    params: { id: String(item.num) },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: true };
}

// 在构建时也会被调用
export async function getStaticProps({ params }: any) {
  // params 包含此篇博文的 `id` 信息。
  // 如果路由是 /posts/1，那么 params.id 就是 1
  const volume = await getVolume(params.id);
  if (!volume) {
    return { notFound: true };
  }
  // 通过 props 参数向页面传递博文的数据
  return { props: { volume }, revalidate: 3600 * 10 };
}
