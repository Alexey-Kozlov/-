using Contracts;
using MassTransit;

namespace ProcessingService.StateMachines.UpdateAuctionStateMachine;
public class UpdateAuctionStateMachine : MassTransitStateMachine<UpdateAuctionState>
{
    public State AuctionUpdatedState { get; }
    public State AuctionUpdatedBidState { get; }
    public State AuctionUpdatedGatewayState { get; }
    public State AuctionUpdatedImageState { get; }
    public State AuctionUpdatedNotificationState { get; }
    public State AuctionUpdatedSearchState { get; }
    public State CompletedState { get; }
    public State FaultedState { get; }

    public Event<RequestAuctionUpdate> RequestAuctionUpdatingEvent { get; }
    public Event<AuctionUpdated> AuctionUpdatedEvent { get; }
    public Event<AuctionUpdatedBid> AuctionUpdatedBidEvent { get; }
    public Event<AuctionUpdatedGateway> AuctionUpdatedGatewayEvent { get; }
    public Event<AuctionUpdatedImage> AuctionUpdatedImageEvent { get; }
    public Event<AuctionUpdatedNotification> AuctionUpdatedNotificationEvent { get; }
    public Event<AuctionUpdatedSearch> AuctionUpdatedSearchEvent { get; }
    public Event<GetAuctionUpdateState> AuctionUpdatedStateEvent { get; }

    public UpdateAuctionStateMachine()
    {
        InstanceState(state => state.CurrentState);
        ConfigureEvents();
        ConfigureInitialState();
        ConfigureAuctionUpdated();
        ConfigureAuctionUpdatedBid();
        ConfigureAuctionUpdatedGateway();
        ConfigureAuctionUpdatedImage();
        ConfigureAuctionUpdatedSearch();
        ConfigureAuctionUpdatedNotification();
        ConfigureCompleted();
        ConfigureAny();
    }
    private void ConfigureEvents()
    {
        Event(() => RequestAuctionUpdatingEvent);
        Event(() => AuctionUpdatedEvent);
        Event(() => AuctionUpdatedBidEvent);
        Event(() => AuctionUpdatedGatewayEvent);
        Event(() => AuctionUpdatedImageEvent);
        Event(() => AuctionUpdatedNotificationEvent);
        Event(() => AuctionUpdatedSearchEvent);
        Event(() => AuctionUpdatedStateEvent);
    }
    private void ConfigureInitialState()
    {
        Initially(
            When(RequestAuctionUpdatingEvent)
            .Then(context =>
            {
                context.Saga.Id = context.Message.Id;
                context.Saga.Title = context.Message.Title;
                context.Saga.Description = context.Message.Description;
                context.Saga.Properties = context.Message.Properties;
                context.Saga.AuctionAuthor = context.Message.AuctionAuthor;
                context.Saga.AuctionEnd = context.Message.AuctionEnd;
                context.Saga.Image = context.Message.Image;
                context.Saga.CorrelationId = context.Message.CorrelationId;
                context.Saga.LastUpdated = DateTime.UtcNow;
            })
            .Send(context => new AuctionUpdating(
                context.Message.Id,
                context.Message.Title,
                context.Message.Properties,
                context.Message.Image,
                context.Message.Description,
                context.Message.AuctionAuthor,
                context.Message.AuctionEnd,
                context.Message.CorrelationId
            ))
            .TransitionTo(AuctionUpdatedState)
        );
    }

    private void ConfigureAuctionUpdated()
    {
        During(AuctionUpdatedState,
        When(AuctionUpdatedEvent)
            .Then(context =>
            {
                context.Saga.LastUpdated = DateTime.UtcNow;
            })
            .Send(context => new AuctionUpdatingBid(
                context.Saga.Id,
                context.Saga.AuctionEnd,
                context.Saga.CorrelationId))
            .TransitionTo(AuctionUpdatedBidState));
    }
    private void ConfigureAuctionUpdatedBid()
    {
        During(AuctionUpdatedBidState,
        When(AuctionUpdatedBidEvent)
            .Then(context =>
            {
                context.Saga.LastUpdated = DateTime.UtcNow;
            })
            .Send(context => new AuctionUpdatingGateway(
                context.Saga.Id,
                context.Saga.CorrelationId))
            .TransitionTo(AuctionUpdatedGatewayState));
    }
    private void ConfigureAuctionUpdatedGateway()
    {
        During(AuctionUpdatedGatewayState,
        When(AuctionUpdatedGatewayEvent)
            .Then(context =>
            {
                context.Saga.LastUpdated = DateTime.UtcNow;
            })
            .Send(context => new AuctionUpdatingImage(
                context.Saga.Id,
                context.Saga.Image,
                context.Saga.CorrelationId))
            .TransitionTo(AuctionUpdatedImageState));
    }
    private void ConfigureAuctionUpdatedImage()
    {
        During(AuctionUpdatedImageState,
        When(AuctionUpdatedImageEvent)
            .Then(context =>
            {
                context.Saga.LastUpdated = DateTime.UtcNow;
            })
            .Send(context => new AuctionUpdatingSearch(
                context.Saga.Id,
                context.Saga.Title,
                context.Saga.Properties,
                context.Saga.Description,
                context.Saga.AuctionAuthor,
                context.Saga.AuctionEnd,
                context.Saga.CorrelationId))
            .TransitionTo(AuctionUpdatedSearchState));
    }
    private void ConfigureAuctionUpdatedSearch()
    {
        During(AuctionUpdatedSearchState,
        When(AuctionUpdatedSearchEvent)
            .Then(context =>
            {
                context.Saga.LastUpdated = DateTime.UtcNow;
            })
            .Send(context => new AuctionUpdatingNotification(
                context.Saga.Id,
                context.Saga.AuctionAuthor,
                context.Saga.CorrelationId))
            .TransitionTo(AuctionUpdatedNotificationState));
    }
    private void ConfigureAuctionUpdatedNotification()
    {
        During(AuctionUpdatedNotificationState,
        When(AuctionUpdatedNotificationEvent)
            .Then(context =>
            {
                context.Saga.LastUpdated = DateTime.UtcNow;
                //по окончании обновления - удаляем изображение для экономии места в БД
                context.Saga.Image = string.IsNullOrEmpty(context.Saga.Image) ? "" : "Обновление изображения";
            })
            .TransitionTo(CompletedState));
    }

    private void ConfigureCompleted()
    {
        During(CompletedState);
    }


    private void ConfigureAny()
    {
        DuringAny(
            When(AuctionUpdatedStateEvent)
                .Respond(x => x.Saga)
        );
    }

}