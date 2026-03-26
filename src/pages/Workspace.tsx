import { ReloadOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { App, Button, Card, Divider, Segmented, Statistic, Typography } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getWorkspaceData } from '@/api/admin/workspace'
import { getProfile } from '@/api/front/user'
import { useNavigate } from 'react-router-dom'

type StatisticRange = 'day' | 'week' | 'month'

export default function Workspace(): React.JSX.Element {
  const { t } = useTranslation('workspace')
  const { message } = App.useApp()
  const navigate = useNavigate()
  const [statisticRange, setStatisticRange] = useState<StatisticRange>('day')

  const {
    data: workspaceData,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ['workspace', statisticRange],
    queryFn: () => getWorkspaceData(statisticRange)
  })
  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile
  })

  const { mcpStats, userStats, assistantStats, chatStats, feedbackStats, aiBalance } =
    workspaceData?.data ?? {}
  const username = profileData?.data.username ?? t('defaultUsername')
  const currentHour = new Date().getHours()
  const greetingKey =
    currentHour < 6
      ? 'nightGreeting'
      : currentHour < 12
        ? 'morningGreeting'
        : currentHour < 18
          ? 'afternoonGreeting'
          : currentHour < 20
            ? 'eveningGreeting'
            : 'nightGreeting'

  return (
    <div className="h-full w-full py-4 px-8 select-none">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between">
          <Typography.Title level={2} className="mb-0">
            {t(greetingKey, { username })}
          </Typography.Title>
          <div className="flex flex-wrap items-center gap-3">
            <Segmented<StatisticRange>
              value={statisticRange}
              options={[
                { label: t('day'), value: 'day' },
                { label: t('week'), value: 'week' },
                { label: t('month'), value: 'month' }
              ]}
              onChange={(value) => setStatisticRange(value)}
            />
            <Button
              variant="filled"
              color="default"
              shape="circle"
              icon={<ReloadOutlined />}
              onClick={() => refetch().then(() => message.success(t('refreshed')))}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            title={t('mcp')}
            className="hover:shadow-lg active:scale-95 cursor-pointer ease-out duration-250"
            onMouseUp={() => navigate('/mcp')}
          >
            <div className="flex gap-4">
              <Statistic
                title={t('totalServers')}
                value={mcpStats?.totalServers}
                loading={isFetching}
              />
              <Divider vertical />
              <Statistic
                title={t('totalTools')}
                value={mcpStats?.totalTools}
                loading={isFetching}
              />
            </div>
          </Card>
          <Card
            title={t('user')}
            className="hover:shadow-lg active:scale-95 cursor-pointer ease-out duration-250"
            onMouseUp={() => navigate('/user')}
          >
            <div className="flex gap-4">
              <Statistic
                title={t('totalUsers')}
                value={userStats?.totalUsers}
                loading={isFetching}
              />
              <Divider vertical />
              <Statistic title={t('newUsers')} value={userStats?.newUsers} loading={isFetching} />
            </div>
          </Card>
          <Card
            title={t('assistant')}
            className="hover:shadow-lg active:scale-95 cursor-pointer ease-out duration-250"
            onMouseUp={() => navigate('/assistant')}
          >
            <div className="flex gap-4">
              <Statistic
                title={t('totalAssistants')}
                value={assistantStats?.totalAssistants}
                loading={isFetching}
              />
              <Divider vertical />
              <Statistic
                title={t('totalPublicAssistants')}
                value={assistantStats?.totalPublicAssistants}
                loading={isFetching}
              />
              <Divider vertical />
              <Statistic
                title={t('newAssistants')}
                value={assistantStats?.newAssistants}
                loading={isFetching}
              />
            </div>
          </Card>
          <Card
            title={t('chat')}
            className="hover:shadow-lg active:scale-95 cursor-pointer ease-out duration-250"
            onMouseUp={() => navigate('/chat')}
          >
            <div className="flex gap-4">
              <Statistic
                title={t('totalChats')}
                value={chatStats?.totalChats}
                loading={isFetching}
              />
              <Divider vertical />
              <Statistic title={t('newChats')} value={chatStats?.newChats} loading={isFetching} />
            </div>
          </Card>
          <Card
            title={t('feedback')}
            className="hover:shadow-lg active:scale-95 cursor-pointer ease-out duration-250"
            onMouseUp={() => navigate('/feedback')}
          >
            <div className="flex gap-4">
              <Statistic
                title={t('newFeedbacks')}
                value={feedbackStats?.newFeedbacks}
                loading={isFetching}
              />
              <Divider vertical />
              <Statistic
                title={t('processingFeedbacks')}
                value={feedbackStats?.processingFeedbacks}
                loading={isFetching}
              />
            </div>
          </Card>
          <Card title={t('balance')} className="hover:shadow-lg ease-out duration-250">
            <div className="flex gap-4">
              <Statistic
                title={t('isAvailable')}
                value={aiBalance?.isAvailable ? t('yes') : t('no')}
                loading={isFetching}
              />
              <Divider vertical />
              <Statistic
                title={`${t('balance')} ${aiBalance?.currency}`}
                value={aiBalance?.balance}
                loading={isFetching}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
