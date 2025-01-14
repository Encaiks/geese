import useCommentHistory from '@/hooks/user/useCommentHistory';
import useUserDetailInfo from '@/hooks/user/useUserDetailInfo';

import Button from '@/components/buttons/Button';
import Pagination from '@/components/pagination/Pagination';
import CommentItem from '@/components/respository/CommentItem';

import { formatZH } from '@/utils/day';

interface Props {
  uid: string;
}

export default function CommentList(props: Props) {
  const { data, setPage } = useCommentHistory(props.uid);
  const userInfo = useUserDetailInfo(props.uid);
  const belongMap = {
    article: '文章',
    repository: '项目',
  };

  return data ? (
    data.data.length ? (
      <>
        {data.data.map((item, index) => {
          return userInfo ? (
            <div className='p-2' key={item.cid}>
              <div className='flex justify-between py-2'>
                <div className='flex'>
                  <span className='mr-4'>
                    {(data.page - 1) * data.pageSize + index + 1}.
                  </span>
                  <span className='text-gray-600 dark:text-gray-300'>
                    于 {formatZH(item.created_at, 'YYYY 年 MM 月 DD 日')} 发布的
                    {belongMap[item.belong]}评论
                  </span>
                </div>

                <div className='whitespace-nowrap text-sm'>
                  {item.is_show ? (
                    <></>
                  ) : (
                    <Button
                      className='mr-1 h-7 p-2 font-normal dark:border-slate-500 dark:text-slate-500'
                      variant='outline'
                    >
                      <a
                        href='https://hellogithub.yuque.com/forms/share/d268c0c0-283f-482a-9ac8-939aa8027dfb'
                        target='_blank'
                        rel='noreferrer'
                      >
                        申诉
                      </a>
                    </Button>
                  )}
                  <Button className='h-7 p-2 font-normal dark:border-slate-500 dark:bg-slate-800 dark:text-slate-500'>
                    <a
                      href={`/${item.belong}/${item.belong_id}`}
                      target='_blank'
                      rel='noreferrer'
                    >
                      查看
                    </a>
                  </Button>
                </div>
              </div>
              <CommentItem
                className='rounded-xl border bg-white p-4 dark:border-gray-700 dark:bg-gray-800'
                key={item.cid}
                {...item}
                user={userInfo}
                footerRight={() => (
                  <span className='text-sm text-gray-400'>
                    {item.is_show ? '已精选' : '未精选'}
                    <span className='mx-1'>·</span>
                    {item.is_hot ? '热评' : '非热评'}
                    <span className='mx-1'>·</span>点赞数：{item.votes}
                  </span>
                )}
              />
            </div>
          ) : null;
        })}
        <Pagination
          hidden={data.total <= 10}
          NextText='下一页'
          PreviousText='上一页'
          current={data.page}
          total={data.page_total}
          onPageChange={setPage}
        />
      </>
    ) : (
      <div className='mt-4 text-center text-xl'>
        <div className='py-14 text-gray-300 dark:text-gray-500'>暂无评论</div>
      </div>
    )
  ) : null;
}
