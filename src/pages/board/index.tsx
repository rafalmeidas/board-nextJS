/* eslint-disable @next/next/link-passhref */
import Head from 'next/head';
import React, { FormEvent } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import { useState } from 'react';

import styles from './styles.module.scss';
import {
  FiPlus,
  FiCalendar,
  FiEdit2,
  FiTrash,
  FiClock,
  FiX,
} from 'react-icons/fi';

import SuporteButton from '../../components/SuporteButton';
import firebase from '../../services/firebaseConnection';
import { format, formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';

type TaskList = {
  id: string;
  created: string | Date;
  createdFormated?: string;
  tarefa: string;
  userId: string;
  nome: string;
};

interface BoardProps {
  user: {
    id: string;
    nome: string;
    vip: boolean;
    lastDonate: string | Date;
  };
  data: string;
}

export default function Board({ user, data }: BoardProps) {
  const [input, setInput] = useState('');
  const [taskList, setTaskList] = useState<TaskList[]>(JSON.parse(data));
  const [taskEdit, setTaskEdit] = useState<TaskList | null>(null);

  async function handleAddTask(e: FormEvent) {
    e.preventDefault();

    if (input === '') {
      alert('Digite uma tarefa!');
      return;
    }

    if (taskEdit) {
      await firebase
        .firestore()
        .collection('tarefas')
        .doc(taskEdit.id)
        .update({ tarefa: input })
        .then(() => {
          console.log('EDITADO COM SUCESSO');
          let data = taskList;
          let taskIndex = taskList.findIndex(item => item.id === taskEdit.id);

          data[taskIndex].tarefa = input;

          setTaskList(data);
          setTaskEdit(null);
          setInput('');
        })
        .catch(error => {
          console.error(error);
        });

      return;
    }

    await firebase
      .firestore()
      .collection('tarefas')
      .add({
        created: new Date(),
        tarefa: input,
        userId: user.id,
        nome: user.nome,
      })
      .then(res => {
        console.log('CADASTRADO COM SUCESSO');
        let data = {
          id: res.id,
          created: new Date(),
          createdFormated: format(new Date(), 'dd MMMM yyyy'),
          tarefa: input,
          userId: user.id,
          nome: user.nome,
        };

        setTaskList([...taskList, data]);
        setInput('');
      })
      .catch(e => {
        console.log('ERRO AO CADASTRAR: ', e);
      });
  }

  async function handleDelete(taskId: string) {
    await firebase
      .firestore()
      .collection('tarefas')
      .doc(taskId)
      .delete()
      .then(() => {
        let taskDeleted = taskList.filter(item => {
          return item.id != taskId;
        });
        setTaskList(taskDeleted);
      })
      .catch(error => {
        console.error(error);
      });
  }

  function handleEditTask(task: TaskList) {
    setTaskEdit(task);
    setInput(task.tarefa);
  }

  function handleCancelEdit() {
    setTaskEdit(null);
    setInput('');
  }

  return (
    <>
      <Head>
        <title>Minhas tarefas - Board</title>
      </Head>
      <main className={styles.container}>
        {taskEdit && (
          <span className={styles.warnText}>
            <button onClick={handleCancelEdit}>
              <FiX size={30} color="#ff3636 " />
            </button>
            Você está editando uma tarefa
          </span>
        )}

        <form onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Digite sua tarefa..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button type="submit">
            <FiPlus size={25} color="#17171f" />
          </button>
        </form>

        <h1>
          Você tem {taskList.length}{' '}
          {taskList.length === 1 ? 'tarefa' : 'tarefas'}
        </h1>

        <section>
          {taskList.map(task => (
            <article key={task.id} className={styles.taskList}>
              <Link href={`/board/${task.id}`}>
                <p>{task.tarefa}</p>
              </Link>
              <div className={styles.actions}>
                <div>
                  <div>
                    <FiCalendar size={20} color="#FFB800" />
                    <time>{task.createdFormated}</time>
                  </div>
                  {user.vip && (
                    <button onClick={() => handleEditTask(task)}>
                      <FiEdit2 size={20} color="#FFF" />
                      <span>Editar</span>
                    </button>
                  )}
                </div>

                <button onClick={() => handleDelete(task.id)}>
                  <FiTrash size={20} color="#FF3636" />
                  <span>Excluir</span>
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>

      {user.vip && (
        <div className={styles.vipContainer}>
          <h3>Obrigado por apoiar o projeto.</h3>
          <div>
            <FiClock size={28} color="#fff" />
            <time>
              Última doação foi a{' '}
              {formatDistance(new Date(user.lastDonate), new Date(), {
                locale: ptBR,
              })}
            </time>
          </div>
        </div>
      )}

      <SuporteButton />
    </>
  );
}

// Parte do servidor
// Tudo aqui aparece no console do VS pois está no lado do servidor
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session?.id) {
    //se o use não estiver logado redireciona
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const tasks = await firebase
    .firestore()
    .collection('tarefas')
    .where('userId', '==', session?.id)
    .orderBy('created', 'asc')
    .get();

  const data = JSON.stringify(
    tasks.docs.map(task => {
      return {
        id: task.id,
        createdFormated: format(task.data().created.toDate(), 'dd MMMM yyyy'),
        ...task.data(),
      };
    })
  );

  const user = {
    nome: session?.user.name,
    id: session?.id,
    vip: session?.vip,
    lastDonate: session?.lastDonate,
  };

  return {
    props: {
      user,
      data,
    },
  };
};
