CREATE TABLE gamestate (
 game_id integer,
 gamejson json,
 CONSTRAINT gamestate_pkey PRIMARY KEY (game_id),
 CONSTRAINT gamestate_game_id_fkey FOREIGN KEY (game_id)
      REFERENCES public.gamestate (game_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);
