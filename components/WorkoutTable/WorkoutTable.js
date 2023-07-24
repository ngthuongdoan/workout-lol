import Link from 'next/link'
import {
  useMantineColorScheme,
  Text,
  Badge,
  Tooltip,
  Table,
  ActionIcon,
  Box,
  Flex,
  Popover,
  CopyButton,
} from '@mantine/core'
import { IconTrash, IconRepeat, IconShare } from '@tabler/icons-react'
import { useSession } from 'next-auth/react'
import { muscleToColor } from '../Exercises/utils'
import styles from './WorkoutTable.module.css'

const ShareIcon = ({ workout = {}, mobile }) => (
  <CopyButton value={`https://workout.lol/?share_id=${workout.id}`}>
    {({ copied, copy }) => (
      <>
        <Popover opened={copied}>
          <Popover.Target>
            <Tooltip label='Share workout'>
              <ActionIcon
                color='green'
                variant='subtle'
                onClick={copy}
                mr={mobile ? 'md' : 0}
              >
                <IconShare />
              </ActionIcon>
            </Tooltip>
          </Popover.Target>

          <Popover.Dropdown>Copied workout link!</Popover.Dropdown>
        </Popover>
      </>
    )}
  </CopyButton>
)

const WorkoutTable = ({ workouts, deleteWorkout, viewOnly = false }) => {
  const { colorScheme } = useMantineColorScheme()
  const { data: session } = useSession()
  const isLoggedIn = session && session.user && session.user.email

  return (
    <>
      <Table striped className={styles.mobileHide}>
        <thead>
          <tr>
            <th style={{ width: '130px' }}>Date</th>
            <th>Exercises</th>
            {!viewOnly && <th />}
          </tr>
        </thead>
        <tbody>
          {workouts.map((w, i) => (
            <tr key={`workout-history-${i}`} mb='sm'>
              <td>
                <Text fw='bold'>
                  {w.exercises.every((e) => e.completed) && '✅ '}
                  {w.created_at.slice(0, 10)}
                </Text>
              </td>
              <td>
                {w.exercises.map((e, j) => (
                  <Tooltip key={`history-${i}-${j}`} label={e.mainMuscle}>
                    <Badge
                      color={muscleToColor[e.mainMuscle]}
                      variant='outline'
                      mr='xs'
                      mb={4}
                      mt={4}
                    >
                      {e.title}
                    </Badge>
                  </Tooltip>
                ))}
              </td>
              {!viewOnly && (
                <>
                  {isLoggedIn && (
                    <td>
                      <ShareIcon workout={w} />
                    </td>
                  )}
                  <td>
                    <Link href={`/?repeat_id=${w.id}`}>
                      <Tooltip label='Repeat workout'>
                        <ActionIcon color='blue' variant='subtle'>
                          <IconRepeat />
                        </ActionIcon>
                      </Tooltip>
                    </Link>
                  </td>
                  <td>
                    <Tooltip label='Delete workout'>
                      <ActionIcon
                        color='red'
                        variant='subtle'
                        onClick={() => deleteWorkout(w.id)}
                      >
                        <IconTrash />
                      </ActionIcon>
                    </Tooltip>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
      <Box className={styles.mobileShow}>
        {workouts.map((w, i) => (
          <Box
            key={`workout-history-${i}`}
            p='sm'
            mb='sm'
            bg={
              colorScheme === 'dark'
                ? i % 2 === 0
                  ? '#1A1B1E'
                  : 'transparent'
                : i % 2 === 0
                ? '#f8f9fa'
                : '#fff'
            }
          >
            <Flex justify='space-between'>
              <Text fw='bold' mb='sm'>
                {w.exercises.every((e) => e.completed) && '✅ '}
                {w.created_at.slice(0, 10)}
              </Text>

              {!viewOnly && (
                <Flex>
                  {isLoggedIn && <ShareIcon workout={w} mobile={true} />}
                  <Link href={`/?repeat_id=${w.id}`}>
                    <Tooltip label='Repeat workout'>
                      <ActionIcon color='blue' variant='subtle' mr='sm'>
                        <IconRepeat />
                      </ActionIcon>
                    </Tooltip>
                  </Link>
                  <Tooltip label='Delete workout'>
                    <ActionIcon
                      color='red'
                      variant='subtle'
                      onClick={() => deleteWorkout(w.id)}
                    >
                      <IconTrash />
                    </ActionIcon>
                  </Tooltip>
                </Flex>
              )}
            </Flex>
            {w.exercises.map((e, j) => (
              <Tooltip key={`history-${i}-${j}`} label={e.mainMuscle}>
                <Badge
                  color={muscleToColor[e.mainMuscle]}
                  variant='outline'
                  mr='xs'
                  mb={4}
                  mt={4}
                >
                  {e.title}
                </Badge>
              </Tooltip>
            ))}
          </Box>
        ))}
      </Box>
    </>
  )
}

export default WorkoutTable
